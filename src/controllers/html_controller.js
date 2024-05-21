const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const generateHtml = async (req, res) => {
    try {
        const { quotation, transportation, accommodation, flights,terms } = req.body;

        const headerEJS = fs.readFileSync(path.join(__dirname, '../../templates/header.ejs'), 'utf8');
        const bodyEJS = fs.readFileSync(path.join(__dirname, '../../templates/body.ejs'), 'utf8');
        const footerEJS = fs.readFileSync(path.join(__dirname, '../../templates/footer.ejs'), 'utf8');
        const headerHTML = ejs.render(headerEJS, { quotation });
        const bodyHTML = ejs.render(bodyEJS, { accommodation, flights, transportation,terms });
        const footerHTML = ejs.render(footerEJS);
        const htmlContent = `${headerHTML}${bodyHTML}${footerHTML}`.replace(/\n/g, '');
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
