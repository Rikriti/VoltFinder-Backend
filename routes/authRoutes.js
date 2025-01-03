const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const authMiddleware = require('../controllers/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Forgot and Reset Password Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/updateProfile', authMiddleware, updateProfile);

module.exports = router;
