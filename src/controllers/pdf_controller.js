const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const pdfService = require('../services/pdf_service');
const directusService = require('../services/directus_service');

const generatePdf = async (req, res) => {
    try {
        const { quotation, transportation, accommodation, flights,terms } = req.body;

        // Read and render EJS templates
        const headerEJS = fs.readFileSync(path.join(__dirname, '../../templates/header.ejs'), 'utf8');
        const bodyEJS = fs.readFileSync(path.join(__dirname, '../../templates/body.ejs'), 'utf8');
        const footerEJS = fs.readFileSync(path.join(__dirname, '../../templates/footer.ejs'), 'utf8');

        const headerHTML = ejs.render(headerEJS, { quotation });
        const bodyHTML = ejs.render(bodyEJS, { accommodation, flights, transportation ,terms});
        const footerHTML = ejs.render(footerEJS);

        //const pdfBuffer = await pdfService.generatePdf(`${headerHTML}${bodyHTML}${footerHTML}`);
        const result = await directusService.login();

        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    generatePdf,
};
