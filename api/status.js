const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  const uptimeInSeconds = process.uptime();
  const uptime = formatUptime(uptimeInSeconds);
  
  res.json({
    status: 'up',
    uptime: uptime
  });
});

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

module.exports = router;

