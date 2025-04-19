const express = require('express');
const router = express.Router();
const { authCodes: authCodes } = require('./auth')

let admins = [ kRxZy_kRxZy, Snoopythe3 ];

router.post('/admin', (req, res) => {
  const auth = req.headers.Authorisation;
  const user = req.body.user;
  const username = req.body.username;
  // pls add how to do 'if auth in authCodes & username in admins. 
