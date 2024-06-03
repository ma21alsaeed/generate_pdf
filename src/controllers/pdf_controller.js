const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const pdfService = require('../services/pdf_service');
const directusService = require('../services/directus_service');

const generatePdf = async (req, res) => {
    try {
        const { quotation, transportation, accommodation, flights, terms } = req.body;

        // Ensure correct template path
        const templatePath = path.join(__dirname, '../../templates/pdf/pdf_template.ejs');
        const templateEJS = fs.readFileSync(templatePath, 'utf8');
        
        // Use absolute paths for includes
        const options = {
            root: path.join(__dirname, '../../templates')
        };
        const htmlContent = ejs.render(templateEJS, { quotation, accommodation, flights, transportation, terms }, options);
        const pdfBuffer = await pdfService.generatePdf(`${htmlContent}`);
        const result = await directusService.uploadPdf(pdfBuffer, quotation.Quote_No);

        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    generatePdf,
};
