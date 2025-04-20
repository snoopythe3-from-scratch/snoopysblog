const express = require('express');
const router = express.Router();
const { authCodes } = require('./auth');

// List of admin usernames
let admins = ['kRxZy_kRxZy', 'Snoopythe3'];

router.post('/admin', (req, res) => {
  const auth = req.headers.authorization;
  const username = req.body.username;
  const userToBeAdmin = req.body.usertobeadmin;

  // Check if the requester is a valid admin with a valid auth code
  if (authCodes.includes(auth) && admins.includes(username)) {
    // Check if the user to be promoted is not already an admin
    if (!admins.includes(userToBeAdmin)) {
      admins.push(userToBeAdmin);
      res.status(200).send(`${userToBeAdmin} has been added as an admin.`);
    } else {
      res.status(409).send(`${userToBeAdmin} is already an admin.`);
    }
  } else {
    res.status(403).send('Forbidden: Unauthorized access');
  }
});

module.exports = router;
