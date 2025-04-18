const express = require('express');
const router = express.Router();

const users = []; // In-memory user storage

// Add new user
router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  if (users.find(user => user.username === username))
    return res.status(409).json({ error: 'Username already exists' });

  users.push({ username, password });
  res.status(201).json({ message: 'User signed up successfully' });
});

// Basic login check
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  const match = users.find(user => user.username === username && user.password === password);
  if (!match)
    return res.status(401).json({ error: 'Invalid credentials' });

  res.status(200).json({ message: 'Login successful' });
});

// Export validation function for auth.js
function isValidUser(username, password) {
  return users.some(user => user.username === username && user.password === password);
}

module.exports = {
  router,
  isValidUser
};
