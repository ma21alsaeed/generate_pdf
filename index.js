const express = require('express');
const pdfRoutes = require('./src/routes/pdf_routes');
const htmlRoutes = require('./src/routes/html_routes');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('templates'));

app.use(pdfRoutes);
app.use(htmlRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
