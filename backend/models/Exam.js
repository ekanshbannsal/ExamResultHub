const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxMarks: { type: Number, required: true, min: 1 },
  passMarks: { type: Number, required: true, min: 0 }
});

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semester: { type: Number, required: true },
  subjects: [subjectSchema],
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
