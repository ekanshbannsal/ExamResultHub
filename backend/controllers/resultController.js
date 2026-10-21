const Result = require('../models/Result');
const Exam = require('../models/Exam');
const User = require('../models/User');

const calculateGrade = (pct, isAnyFailed) => {
  if (isAnyFailed || pct < 50) return 'F';
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
};

const saveResult = async (req, res, next) => {
  try {
    const { studentId, examId, marks } = req.body;
    if (!studentId || !examId || !marks || !Array.isArray(marks)) {
      return res.status(400).json({ message: 'Student, exam, and marks array are required' });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Valid student not found' });
    }

    let totalMarks = 0;
    let totalMaxMarks = 0;
    let isAnyFailed = false;

    const validatedMarks = [];

    for (let sub of exam.subjects) {
      const given = marks.find(m => m.subjectName === sub.name);
      if (!given || given.marksObtained === undefined || given.marksObtained === '') {
        return res.status(400).json({ message: `Marks missing for subject: ${sub.name}` });
      }

      const score = Number(given.marksObtained);
      if (score < 0 || score > sub.maxMarks) {
        return res.status(400).json({
          message: `Marks for ${sub.name} must be between 0 and ${sub.maxMarks}`
        });
      }

      if (score < sub.passMarks) {
        isAnyFailed = true;
      }

      totalMarks += score;
      totalMaxMarks += sub.maxMarks;
      validatedMarks.push({
        subjectName: sub.name,
        marksObtained: score
      });
    }

    const percentage = totalMaxMarks > 0 ? Number(((totalMarks / totalMaxMarks) * 100).toFixed(2)) : 0;
    const grade = calculateGrade(percentage, isAnyFailed);
    const status = isAnyFailed ? 'Fail' : 'Pass';

    let result = await Result.findOne({ student: studentId, exam: examId });
    if (result) {
      result.marks = validatedMarks;
      result.totalMarks = totalMarks;
      result.percentage = percentage;
      result.grade = grade;
      result.status = status;
      await result.save();
    } else {
      result = await Result.create({
        student: studentId,
        exam: examId,
        marks: validatedMarks,
        totalMarks,
        percentage,
        grade,
        status
      });
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getExamResults = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const results = await Result.find({ exam: examId })
      .populate('student', 'name email rollNumber semester')
      .sort({ percentage: -1 });

    let currentRank = 1;
    const rankedResults = results.map((item, index) => {
      if (index > 0 && item.percentage < results[index - 1].percentage) {
        currentRank = index + 1;
      }
      return {
        ...item.toObject(),
        rank: currentRank
      };
    });

    res.json({ exam, results: rankedResults });
  } catch (err) {
    next(err);
  }
};

const getMyResults = async (req, res, next) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('exam')
      .sort({ createdAt: -1 });

    const publishedResults = results.filter(r => r.exam && r.exam.isPublished);
    res.json(publishedResults);
  } catch (err) {
    next(err);
  }
};

const getReportCard = async (req, res, next) => {
  try {
    const { examId } = req.params;
    let studentId = req.user.role === 'student' ? req.user._id : req.query.studentId;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (req.user.role === 'student' && !exam.isPublished) {
      return res.status(403).json({ message: 'Results are not published yet' });
    }

    const result = await Result.findOne({ exam: examId, student: studentId })
      .populate('student', 'name email rollNumber semester')
      .populate('exam');

    if (!result) {
      return res.status(404).json({ message: 'Result not found for this student and exam' });
    }

    const allExamResults = await Result.find({ exam: examId }).sort({ percentage: -1 });
    let rank = 1;
    for (let i = 0; i < allExamResults.length; i++) {
      if (i > 0 && allExamResults[i].percentage < allExamResults[i - 1].percentage) {
        rank = i + 1;
      }
      if (allExamResults[i].student.toString() === studentId.toString()) {
        break;
      }
    }

    res.json({ ...result.toObject(), rank });
  } catch (err) {
    next(err);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const totalExams = await Exam.countDocuments();
    const publishedExams = await Exam.countDocuments({ isPublished: true });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalResults = await Result.countDocuments();

    const allResults = await Result.find().populate('student', 'name rollNumber').populate('exam', 'name');

    let passCount = 0;
    let failCount = 0;
    allResults.forEach(r => {
      if (r.status === 'Pass') passCount++;
      else failCount++;
    });

    const passPercentage = totalResults > 0 ? Number(((passCount / totalResults) * 100).toFixed(2)) : 0;

    const subjectStatsMap = {};
    allResults.forEach(r => {
      r.marks.forEach(m => {
        if (!subjectStatsMap[m.subjectName]) {
          subjectStatsMap[m.subjectName] = { total: 0, count: 0, highest: 0 };
        }
        subjectStatsMap[m.subjectName].total += m.marksObtained;
        subjectStatsMap[m.subjectName].count += 1;
        if (m.marksObtained > subjectStatsMap[m.subjectName].highest) {
          subjectStatsMap[m.subjectName].highest = m.marksObtained;
        }
      });
    });

    const subjectStats = Object.keys(subjectStatsMap).map(sub => ({
      subject: sub,
      average: Number((subjectStatsMap[sub].total / subjectStatsMap[sub].count).toFixed(2)),
      highest: subjectStatsMap[sub].highest
    }));

    const topStudents = await Result.find()
      .populate('student', 'name rollNumber')
      .populate('exam', 'name')
      .sort({ percentage: -1 })
      .limit(5);

    res.json({
      totalExams,
      publishedExams,
      totalStudents,
      totalResults,
      passPercentage,
      passCount,
      failCount,
      subjectStats,
      topStudents
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  saveResult,
  getExamResults,
  getMyResults,
  getReportCard,
  getDashboardStats
};
