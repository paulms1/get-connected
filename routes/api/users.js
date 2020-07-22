const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [check('name', 'Name is required').not().isEmpty()],
  check('email', 'Please include valid email').isEmail(),
  check(
    'password',
    'Please enter a password between 6 and 20 chatacters'
  ).isLength({ min: 6, max: 20 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send('User route');
  }
);

module.exports = router;
