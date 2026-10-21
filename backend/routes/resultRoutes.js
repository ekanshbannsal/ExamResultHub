const express = require('express');
const router = express.Router();
const {
  saveResult,
  getExamResults,
  getMyResults,
  getReportCard,
  getDashboardStats
} = require('../controllers/resultController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.post('/', protect, allowRoles('admin'), saveResult);
router.get('/exam/:examId', protect, allowRoles('admin'), getExamResults);
router.get('/my-results', protect, allowRoles('student'), getMyResults);
router.get('/report-card/:examId', protect, getReportCard);
router.get('/dashboard-stats', protect, allowRoles('admin'), getDashboardStats);

module.exports = router;
