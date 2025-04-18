const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { router: usersRouter } = require('./api/users');
const { router: authRouter } = require('./api/auth');
const articlesRouter = require('./api/artic');

const app = express();
// app.use(bodyParser.json());

app.use(express.static('static'));


// Serve the 'static' folder at the root URL
const staticPath = path.join(__dirname, 'static');
app.use(express.static(staticPath));

// API Routes
app.use('/api', usersRouter);  // /signup and /login
app.use('/api', authRouter);   // /auth
app.use('/api', articlesRouter); // /articles

// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
