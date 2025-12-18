const crypto = require('crypto');
const nodemailer = require('nodemailer'); // reserved for future email sending
const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const LoginAttempt = require('../models/LoginAttempt');
const User = require('../models/User');

const {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenDoc,
  revokeRefreshToken,
  revokeAllTokensForUser,
} = require('../utils/jwt');

const { auth, requireRole } = require('../middleware/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & session management
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */
router.post('/signup', [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[0-9]/),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user',
    });

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown';

    const { token: refreshToken } = await generateRefreshToken(user, ip);
    const accessToken = generateAccessToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name, email: user.email, role: user.role },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const MAX_FAILED_ATTEMPTS = 5;
  const LOCK_TIME_MINUTES = 15;

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({ success: false, message: 'Account locked' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MINUTES * 60000);
        user.failedLoginAttempts = 0;
      }
      await user.save();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const ip = req.socket.remoteAddress || 'unknown';
    const accessToken = generateAccessToken(user);
    const { token: refreshToken } = await generateRefreshToken(user, ip);

    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh-token', async (req, res) => {
  try {
    const tokenDoc = await getRefreshTokenDoc(req.body.refreshToken);
    if (!tokenDoc || !tokenDoc.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = tokenDoc.user;
    const ip = req.socket.remoteAddress || 'unknown';

    const accessToken = generateAccessToken(user);
    const { token: newRefreshToken } = await generateRefreshToken(user, ip);

    await revokeRefreshToken(tokenDoc, ip, newRefreshToken);

    res.json({
      success: true,
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Refresh failed' });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout from current session
 *     tags: [Auth]
 */
router.post('/logout', async (req, res) => {
  const tokenDoc = await getRefreshTokenDoc(req.body.refreshToken);
  if (tokenDoc) await revokeRefreshToken(tokenDoc, 'logout');
  res.json({ success: true });
});

/**
 * @swagger
 * /api/auth/logout-all:
 *   post:
 *     summary: Logout from all sessions
 *     tags: [Auth]
 */
router.post('/logout-all', auth, async (req, res) => {
  await revokeAllTokensForUser(req.user._id);
  res.json({ success: true });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 */
router.get('/me', auth, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

/**
 * @swagger
 * /api/auth/admin/login-attempts:
 *   get:
 *     summary: Get login attempts (admin)
 *     tags: [Auth]
 */
router.get('/admin/login-attempts', auth, requireRole('admin'), async (req, res) => {
  const attempts = await LoginAttempt.find().sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, data: attempts });
});

module.exports = router;
