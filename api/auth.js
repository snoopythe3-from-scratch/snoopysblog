const express = require('express');
const router = express.Router();
const { isValidUser } = require('./users');

const authCodes = {}; // Store auth codes

function generateAuthCode(username) {
  return Buffer.from(`${username}-${Date.now()}`).toString('base64');
}

// Get auth code if user is valid
router.post('/auth', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  if (!isValidUser(username, password))
    return res.status(401).json({ error: 'Invalid credentials' });

  const code = generateAuthCode(username);
  authCodes[username] = code;

  res.status(201).json({ authCode: code });
});

module.exports = {
  router,
  authCodes
};
