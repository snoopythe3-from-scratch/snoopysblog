const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Destructure named export `router` from each module
const { router: adminRouter } = require('./api/admin');
const { router: authRouter } = require('./api/auth');
const { router: usersRouter } = require('./api/users');
const { router: articlesRouter } = require('./api/articles');

const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// CORS and body parser
app.use(cors({ origin: 'https://the-scratch-channel.github.io' }));
app.use(bodyParser.json());

// Static files
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'pages')));

// API Routes
app.use('/', usersRouter);     // Moved under /api/users/*
app.use('/api/auth', authRouter);       // /api/auth/*
app.use('/api/articles', articlesRouter); // /api/articles/*
app.use('/api/admin', adminRouter);     // /api/admin/*

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
