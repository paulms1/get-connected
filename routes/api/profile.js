const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const profile = require('../../models/Profile');
const user = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', 'name');

    if (!profile) {
      return res.status(400).json({ msg: 'No such profile exists' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('location', 'Location is required')
        .trim()
        .not()
        .isEmpty()
        .bail()
        .isString()
        .escape(),
      check('mainInstrument', 'Main instrument is required')
        .trim()
        .not()
        .isEmpty()
        .bail()
        .isString()
        .escape(),
      check('level', 'Level is required')
        .trim()
        .not()
        .isEmpty()
        .bail()
        .isString()
        .escape(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  }
);

module.exports = router;
