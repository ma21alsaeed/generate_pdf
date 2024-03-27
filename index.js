const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// API endpoint to generate and return HTML
app.post('/generate-html', async (req, res) => {
    try {
        // Data from the request body
        const { quotation, transportation, accommodation, flights } = req.body;

        // Read EJS template files
        console.log(transportation);
        const headerEJS = fs.readFileSync(path.join(__dirname, 'templates', 'header.ejs'), 'utf8');
        const bodyEJS = fs.readFileSync(path.join(__dirname, 'templates', 'body.ejs'), 'utf8');
        const footerEJS = fs.readFileSync(path.join(__dirname, 'templates', 'footer.ejs'), 'utf8');

        // Render EJS templates with provided data
        const headerHTML = ejs.render(headerEJS, { quotation });
        const bodyHTML = ejs.render(bodyEJS, { accommodation, flights, transportation });
        const footerHTML = ejs.render(footerEJS);

// Generate HTML content
let htmlContent = `${headerHTML}${bodyHTML}${footerHTML}`;

// Remove newline characters
htmlContent = htmlContent.replace(/\n/g, '');



        // Send HTML as response
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API endpoint to generate and return PDF
app.post('/generate-pdf', async (req, res) => {
    try {
        // Data from the request body
        const { quotation, transportation, accommodation, flights } = req.body;

        // Read EJS template files
        const headerEJS = fs.readFileSync(path.join(__dirname, 'templates', 'header.ejs'), 'utf8');
        const bodyEJS = fs.readFileSync(path.join(__dirname, 'templates', 'body.ejs'), 'utf8');
        const footerEJS = fs.readFileSync(path.join(__dirname, 'templates', 'footer.ejs'), 'utf8');

        // Render EJS templates with provided data
        const headerHTML = ejs.render(headerEJS, { quotation });
        const bodyHTML = ejs.render(bodyEJS, { accommodation, flights, transportation });
        const footerHTML = ejs.render(footerEJS);

        // Generate HTML content
        let htmlContent = `
            ${headerHTML}
            ${bodyHTML}
            ${footerHTML}
        `;

        // Launch Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set content and render PDF
        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf();

        // Close browser
        await browser.close();

        // Send PDF as response
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running`);
});
