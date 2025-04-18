const express = require('express');
const router = express.Router();
const { authCodes } = require('./auth');

let articles = [];

// Create article
router.post('/articles', (req, res) => {
  const { title, content, owner } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  // Check if auth code is valid
  const isValid = Object.values(authCodes).includes(authHeader);
  if (!isValid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const newArticle = {
    title,
    content,
    owner,
    createdAt: new Date().toISOString(),
  };

  articles.push(newArticle);
  res.status(201).json({ message: 'Article created', article: newArticle });
});

// Get all articles
router.get('/articles', (req, res) => {
  res.json(articles);
});

module.exports = router;
