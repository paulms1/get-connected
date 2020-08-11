const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Require in User model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include valid email')
      .trim()
      .not()
      .isEmpty()
      .bail()
      .isString()
      .isEmail()
      .bail()
      .escape()
      .normalizeEmail(),
    check('age', 'age is required')
      .trim()
      .not()
      .isEmpty()
      .bail()
      .toInt()
      .isInt({ min: 16 })
      .withMessage('You must be 16 years of age to register on this site')
      .isInt({ max: 120 })
      .withMessage('The oldest person in the world is 116 years old'),
    check('password', 'Please enter a password between 8 and 20 chatacters')
      .isString()
      .isLength({ min: 8, max: 20 })
      .bail()
      .matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})')
      .withMessage(
        'Password must contain one lowercase and one uppercase letter, one number and one special character'
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, age, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        age,
        email,
        password,
      });

      //  Encrypt password using bcrypt

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //  Return jsonwebtoken (remember to change expires to 3600(1hr))

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
