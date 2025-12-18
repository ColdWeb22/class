const express = require('express');
const router = express.Router();
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const { register, login, getProfile, updateProfile, googleCallback } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, profileUpdateValidation } = require('../middleware/validation');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { success: false, error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictAuthLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per hour
  message: { success: false, error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', strictAuthLimiter, loginValidation, login);

// Google OAuth routes - only enable if Google OAuth is configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  router.get('/google/callback',
    passport.authenticate('google', { 
      failureRedirect: '/login',
      session: false 
    }),
    googleCallback
  );
} else {
  // Return error message if Google OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({ 
      success: false, 
      error: 'Google authentication is not configured on this server.' 
    });
  });
  
  router.get('/google/callback', (req, res) => {
    res.status(503).json({ 
      success: false, 
      error: 'Google authentication is not configured on this server.' 
    });
  });
}

router.get('/profile', protect, getProfile);
router.put('/profile', protect, profileUpdateValidation, updateProfile);

module.exports = router;
