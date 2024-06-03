const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const generateHtml = async (req, res) => {
    try {
        const { quotation, transportation, accommodation, flights, terms } = req.body;

        const templateEJS = fs.readFileSync(path.join(__dirname, '../templates/pdf/pdf_template.ejs'), 'utf8');
        const htmlContent = ejs.render(templateEJS, { quotation, accommodation, flights, transportation, terms });
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    generateHtml,
};
