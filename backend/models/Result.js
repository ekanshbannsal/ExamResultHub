const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  marksObtained: { type: Number, required: true, min: 0 }
});

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  marks: [markSchema],
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  grade: { type: String, required: true },
  status: { type: String, enum: ['Pass', 'Fail'], required: true }
}, { timestamps: true });

resultSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
