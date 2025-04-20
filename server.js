// Modules 
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const { router: adminRouter } = require('./api/admin');
const { router: authRouter } = require('./api/auth');
const articlesRouter = require('./api/articles');

const app = express();
// CORS policy
app.use(cors({ origin: 'https://the-scratch-channel.github.io' }));
app.use(bodyParser.json());

app.use(express.static('static'));
app.use(express.static("pages"));

// Serve the 'static' folder at the root URL
const staticPath = path.join(__dirname, 'static');
app.use(express.static(staticPath));

// API Routes
app.use('/api', usersRouter);  // /signup and /login
app.use('/api', authRouter);   // /auth
app.use('/api', articlesRouter);
app.use('/api', adminRouter);
// /articles

// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('Make sure the website loaded correctly!');
  console.log('Get help if incorrectly loaded: github.com/the-scratch-channel/the-scratch-channel.github.io/issues')
});
