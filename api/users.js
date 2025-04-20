const express = require('express');
const { authCodes } = require('./auth');
const { admins } = require('./admin');
const router = express.Router();
let users = [];

router.post('/api/new-user', (req, res) => {
  const auth = req.headers.Authorisation;
  const { username } = req.body;
  res.json({ "message": "Welcome New User" });
  users.push(username);
});


