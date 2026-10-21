const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Exam = require('./models/Exam');
const Result = require('./models/Result');

dotenv.config();

const dummyStudents = [
  { name: 'Aarav Sharma', email: 'aarav@college.edu', rollNumber: 'CS202601', semester: 4 },
  { name: 'Diya Patel', email: 'diya@college.edu', rollNumber: 'CS202602', semester: 4 },
  { name: 'Rohan Gupta', email: 'rohan@college.edu', rollNumber: 'CS202603', semester: 4 },
  { name: 'Ananya Verma', email: 'ananya@college.edu', rollNumber: 'CS202604', semester: 4 },
  { name: 'Ishaan Singh', email: 'ishaan@college.edu', rollNumber: 'CS202605', semester: 4 },
  { name: 'Meera Iyer', email: 'meera@college.edu', rollNumber: 'CS202606', semester: 4 },
  { name: 'Kabir Mehta', email: 'kabir@college.edu', rollNumber: 'CS202607', semester: 4 },
  { name: 'Sanya Malhotra', email: 'sanya@college.edu', rollNumber: 'CS202608', semester: 4 },
  { name: 'Aditya Rao', email: 'aditya@college.edu', rollNumber: 'CS202609', semester: 4 },
  { name: 'Tanvi Joshi', email: 'tanvi@college.edu', rollNumber: 'CS202610', semester: 4 },
  { name: 'Vivaan Reddy', email: 'vivaan@college.edu', rollNumber: 'CS202611', semester: 4 },
  { name: 'Kavya Nair', email: 'kavya@college.edu', rollNumber: 'CS202612', semester: 4 }
];

const calculateGrade = (pct, isAnyFailed) => {
  if (isAnyFailed || pct < 50) return 'F';
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Exam.deleteMany();
    await Result.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    const admin = await User.create({
      name: 'Exam Controller Admin',
      email: 'admin@college.edu',
      password: adminPassword,
      role: 'admin'
    });

    const createdStudents = [];
    for (let s of dummyStudents) {
      const student = await User.create({
        ...s,
        password: studentPassword,
        role: 'student'
      });
      createdStudents.push(student);
    }

    const exam1 = await Exam.create({
      name: 'Mid-Sem Examination 2026',
      semester: 4,
      isPublished: true,
      subjects: [
        { name: 'Data Structures', maxMarks: 100, passMarks: 40 },
        { name: 'Operating Systems', maxMarks: 100, passMarks: 40 },
        { name: 'Database Management', maxMarks: 100, passMarks: 40 },
        { name: 'Computer Networks', maxMarks: 100, passMarks: 40 }
      ]
    });

    const exam2 = await Exam.create({
      name: 'Final Semester Examination 2026',
      semester: 4,
      isPublished: false,
      subjects: [
        { name: 'Software Engineering', maxMarks: 100, passMarks: 40 },
        { name: 'Web Technologies', maxMarks: 100, passMarks: 40 },
        { name: 'Compiler Design', maxMarks: 100, passMarks: 40 }
      ]
    });

    const marksSamples = [
      [95, 92, 94, 91],
      [88, 85, 90, 87],
      [78, 82, 75, 80],
      [92, 95, 89, 94],
      [65, 70, 68, 72],
      [85, 89, 88, 86],
      [58, 62, 55, 60],
      [91, 88, 93, 90],
      [42, 38, 55, 60],
      [74, 76, 72, 78],
      [82, 80, 84, 83],
      [96, 94, 98, 95]
    ];

    for (let i = 0; i < createdStudents.length; i++) {
      const student = createdStudents[i];
      const scores = marksSamples[i];

      let total = 0;
      let totalMax = 0;
      let isAnyFailed = false;

      const marksArray = exam1.subjects.map((sub, idx) => {
        const score = scores[idx];
        total += score;
        totalMax += sub.maxMarks;
        if (score < sub.passMarks) isAnyFailed = true;
        return { subjectName: sub.name, marksObtained: score };
      });

      const percentage = Number(((total / totalMax) * 100).toFixed(2));
      const grade = calculateGrade(percentage, isAnyFailed);
      const status = isAnyFailed ? 'Fail' : 'Pass';

      await Result.create({
        student: student._id,
        exam: exam1._id,
        marks: marksArray,
        totalMarks: total,
        percentage,
        grade,
        status
      });
    }

    console.log('Seeding completed successfully!');
    console.log('Admin account: admin@college.edu / admin123');
    console.log('Student account: aarav@college.edu / student123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
