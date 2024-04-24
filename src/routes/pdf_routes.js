const express = require('express');
const { generatePdf } = require('../controllers/pdf_controller');

const router = express.Router();

router.post('/generate-pdf', generatePdf);

module.exports = router;
