const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const { createDirectus, rest, uploadFiles } = require('@directus/sdk');
const { readFileSync } = require('fs');


require("dotenv").config();
const app = express();
app.use(express.static('public'));
app.use(express.static('templates'));

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
        const browser = await puppeteer.launch({
            args: [
              "--disable-setuid-sandbox",
              "--no-sandbox",
              "--single-process",
              "--no-zygote",
            ],
            executablePath:
              process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
          });
        const page = await browser.newPage();

        // Set content and render PDF
        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf();

        // Close browser
        await browser.close();

        // Send PDF as response
        res.setHeader('Content-Type', 'application/pdf');
                // ... (your existing code to generate the PDF)

        // Create a Directus client
        const client = createDirectus('http://207.244.242.3:8055').with(rest());

        // Create a new form data object
        const formData = new FormData();

        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        formData.append('file', pdfBlob, quotation.Quote_No.toString()+".pdf");


        // Add any other fields to the form data
        formData.append('title', quotation.Quote_No.toString());
        
        // Upload the file to Directus
        const result = await client.request(uploadFiles(formData));
        res.send(result);
        


    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

// Listen on `port` and 0.0.0.0
app.listen(port, function () {
  // ...
});