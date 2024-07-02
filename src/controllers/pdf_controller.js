const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const pdfService = require('../services/pdf_service');
const directusService = require('../services/directus_service');

const generatePdf = async (req, res) => {
    try {
        const { quotation, transportation, accommodation, flights, terms } = req.body;
      
        // Ensure correct template path
        const footerPath = path.join(__dirname, '../../templates/partials/footer.ejs');
        const footerEJS = fs.readFileSync(footerPath, 'utf8');
        const headerPath = path.join(__dirname, '../../templates/partials/header.ejs');
        const headerEJS = fs.readFileSync(headerPath, 'utf8');
        const templatePath = path.join(__dirname, '../../templates/pdf/pdf_template.ejs');
        const templateEJS = fs.readFileSync(templatePath, 'utf8');
      
        // Use absolute paths for includes
        const options = {
            root: path.join(__dirname, '../../templates')
        };
        const htmlContent = ejs.render(templateEJS, {accommodation, flights, transportation, terms }, options);
        const footerContent = ejs.render(footerEJS);
        const headerContent = ejs.render(headerEJS,{quotation});
        const pdfBuffer = await pdfService.generatePdf(`${htmlContent}`,`${footerContent}`,`${headerContent}`);
        //30-06-2024_holiday_house_2024-1-28
        const result = await directusService.uploadPdf(pdfBuffer, quotation.data_created+"_"+quotation.customer+"_"+quotation.Quote_No);

        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    generatePdf,
};
