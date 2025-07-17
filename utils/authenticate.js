require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../model/user.js');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('🛂 Token received:', token);

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    console.log('✅ Token decoded:', decoded);   
    console.log('🧪 Type of decoded.id:', typeof decoded.id);           // Should log user ID
    console.log('✅ User found:', user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;
