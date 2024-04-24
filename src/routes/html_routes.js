const express = require('express');
const { generateHtml } = require('../controllers/html_controller');

const router = express.Router();

router.post('/generate-html', generateHtml);

module.exports = router;
