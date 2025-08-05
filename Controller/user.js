require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../model/user');
const authenticate = require('../utils/authenticate.js'); 
const upload = require('../utils/upload.js');



const router = express.Router();

const { JWT_SECRET} = process.env;
// Signup Route

router.post('/signup', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ errors: [{ msg: 'Email already registered' }] });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });
  res.json({ message: 'User created successfully' });
});

// Signin Route
router.post(
  '/SignIn',
  [
    body('email', 'Email is required').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: 'Invalid email or password' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Invalid email or password' });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// /Controller/user.js
router.put('/profile-photo', authenticate, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.photo = req.file.path;
    await user.save();

    res.status(200).json({ message: 'Photo updated', photo: user.photo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
