const express = require('express');
const router = express.Router();
const { authCodes } = require('./auth');

let articles = [];

router.post('/articles', (req, res) => {
  const { title, content } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const isValid = Object.values(authCodes).includes(authHeader);
  if (!isValid) return res.status(401).json({ error: 'Unauthorized' });

  const newArticle = {
    title,
    content,
    createdAt: new Date().toISOString()
  };

  articles.push(newArticle);
  res.status(201).json({ message: 'Article created', article: newArticle });
});

router.get('/articles', (req, res) => {
  res.json(articles);
});

module.exports = { router };
