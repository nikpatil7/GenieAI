const express = require('express');
const { summaryController, paragraphController } = require('../controllers/openaiController');

const router = express.Router();

router.post('/summary', summaryController);
router.post('/paragraph', paragraphController);

module.exports = router; 