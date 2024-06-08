const puppeteer = require('puppeteer');

const generatePdf = async (htmlContent, footer) => {
    const browser = await puppeteer.launch({
        args: [
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--single-process',
            '--no-zygote',
        ],
        executablePath:
            process.env.NODE_ENV === 'production'
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    // Set the content first
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Evaluate the height after setting the content
    let height = await page.evaluate(() => document.documentElement.scrollHeight);

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        footerTemplate: footer,
        height: height + 'px', // Set the height according to the content
        margin: {
            top: '10px',
            right: '6px',
            bottom: '10px',
            left: '6px'
        }
    });

    await browser.close();

    return pdfBuffer;
};

module.exports = {
    generatePdf,
};
