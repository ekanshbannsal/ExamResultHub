const express = require('express');
const router = express.Router();
const {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  togglePublish
} = require('../controllers/examController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.get('/', protect, getExams);
router.post('/', protect, allowRoles('admin'), createExam);
router.get('/:id', protect, getExamById);
router.put('/:id', protect, allowRoles('admin'), updateExam);
router.delete('/:id', protect, allowRoles('admin'), deleteExam);
router.patch('/:id/toggle-publish', protect, allowRoles('admin'), togglePublish);

module.exports = router;
