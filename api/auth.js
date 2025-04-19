const express = require('express');
const router = express.Router();

const authCodes = {};

function generateAuthCode(username) {
  return Buffer.from(`${username}-${Date.now()}`).toString('base64');
}

router.post('/auth', (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });
  const code = generateAuthCode(username);
  authCodes[username] = `Bearer ${code}`;

  res.status(201).json({ authCode: `${code}` });
});

module.exports = {
  router,
  authCodes
};
