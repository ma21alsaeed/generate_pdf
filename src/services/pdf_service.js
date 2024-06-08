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
    await page.setContent(htmlContent);

    // Then evaluate the height
    let height = await page.evaluate(() => document.documentElement.offsetHeight);

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        footerTemplate: footer,
        margin: {
            top:  height * 0.05 + 'px',
            right: '12px', 

            bottom: '120px',
            left: '12px'
        }
    });

    await browser.close();

    return pdfBuffer;
};

module.exports = {
    generatePdf,
};
