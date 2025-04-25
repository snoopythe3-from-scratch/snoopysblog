// Modules
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const { router: adminRouter } = require('./api/admin');
const { router: authRouter } = require('./api/auth');
const { router: usersRouter } = require('./api/users');
const articlesRouter = require('./api/articles');

const app = express();

// Security headers middleware
app.use((req, res, next) => {
  // Disable <iframe> usage
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
  // Enable basic XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Disable MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// CORS policy
app.use(cors({ origin: 'https://the-scratch-channel.github.io' }));

// Body parser
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'pages')));

// API Routes
app.use(usersRouter);              // Routes like /signup and /login (NO /api prefix)
app.use('/api', authRouter);       // /api/auth/*
app.use('/api', articlesRouter);   // /api/articles/*
app.use('/api', adminRouter);      // /api/admin/*

// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('🆘 Need help? Visit: github.com/the-scratch-channel/the-scratch-channel.github.io/issues');
});
