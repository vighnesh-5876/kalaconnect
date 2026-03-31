const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getMe, updateProfile, getSellerProfile } = require('./authController');
const { protect } = require('./auth');
const upload = require('./upload');

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['buyer', 'seller']).withMessage('Role must be buyer or seller'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/seller/:id', getSellerProfile);

module.exports = router;
