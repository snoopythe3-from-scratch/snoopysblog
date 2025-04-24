const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authCodes = {};

function generateAuthCode(username) {
  return Buffer.from(`${username}-${Date.now()}`).toString('base64');
}

const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per `window` (here, per minute)
  message: { error: 'Too many requests, please try again later.' },
});

router.post('/auth', authRateLimiter, (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });
  const code = generateAuthCode(username);
  authCodes[username] = `Bearer ${code}`;

  res.status(201).json({ authCode: `${code}` });
});

module.exports = {
  router,
  authCodes
};
