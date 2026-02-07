import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

// @route   GET /auth/google
// @desc    Redirect to Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect(`${process.env.CLIENT_URL}?auth=success`);
  }
);

// @route   GET /auth/user
// @desc    Get current authenticated user
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }
});

// @route   POST /auth/logout
// @desc    Logout user
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  });
});

export default router;
