const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getStudents } = require('../controllers/authController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/students', protect, allowRoles('admin'), getStudents);

module.exports = router;
