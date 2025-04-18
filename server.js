const express = require('express');
const bodyParser = require('body-parser');
const { router: usersRouter } = require('./api/users');
const { router: authRouter } = require('./api/auth');
const articlesRouter = require('./api/artic');

const app = express();
// app.use(bodyParser.json());

app.use(express.static('static'));

app.use('/api', usersRouter);  // /signup and /login
app.use('/api', authRouter);   // /auth
app.use('/api', articlesRouter); // /articles

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
