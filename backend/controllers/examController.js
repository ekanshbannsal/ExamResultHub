const Exam = require('../models/Exam');
const Result = require('../models/Result');

const getExams = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'student') {
      filter.isPublished = true;
      if (req.user.semester) {
        filter.semester = req.user.semester;
      }
    }
    const exams = await Exam.find(filter).sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    next(err);
  }
};

const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    if (req.user.role === 'student' && !exam.isPublished) {
      return res.status(403).json({ message: 'This exam result is not published yet' });
    }
    res.json(exam);
  } catch (err) {
    next(err);
  }
};

const createExam = async (req, res, next) => {
  try {
    const { name, semester, subjects } = req.body;
    if (!name || !semester || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: 'Exam name, semester, and at least one subject are required' });
    }

    for (let sub of subjects) {
      if (!sub.name || sub.maxMarks === undefined || sub.passMarks === undefined) {
        return res.status(400).json({ message: 'Each subject must have name, max marks and pass marks' });
      }
      if (Number(sub.maxMarks) <= 0 || Number(sub.passMarks) < 0) {
        return res.status(400).json({ message: 'Max marks must be greater than 0, pass marks cannot be negative' });
      }
      if (Number(sub.passMarks) > Number(sub.maxMarks)) {
        return res.status(400).json({ message: 'Pass marks cannot exceed max marks' });
      }
    }

    const exam = await Exam.create({
      name,
      semester: Number(semester),
      subjects
    });

    res.status(201).json(exam);
  } catch (err) {
    next(err);
  }
};

const updateExam = async (req, res, next) => {
  try {
    const { name, semester, subjects } = req.body;
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (subjects && subjects.length > 0) {
      for (let sub of subjects) {
        if (!sub.name || sub.maxMarks === undefined || sub.passMarks === undefined) {
          return res.status(400).json({ message: 'Each subject must have name, max marks and pass marks' });
        }
        if (Number(sub.maxMarks) <= 0 || Number(sub.passMarks) < 0) {
          return res.status(400).json({ message: 'Invalid marks values' });
        }
        if (Number(sub.passMarks) > Number(sub.maxMarks)) {
          return res.status(400).json({ message: 'Pass marks cannot exceed max marks' });
        }
      }
      exam.subjects = subjects;
    }

    if (name) exam.name = name;
    if (semester) exam.semester = Number(semester);

    const updatedExam = await exam.save();
    res.json(updatedExam);
  } catch (err) {
    next(err);
  }
};

const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    await Result.deleteMany({ exam: exam._id });
    await exam.deleteOne();
    res.json({ message: 'Exam and related results removed' });
  } catch (err) {
    next(err);
  }
};

const togglePublish = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    exam.isPublished = !exam.isPublished;
    await exam.save();
    res.json(exam);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  togglePublish
};
