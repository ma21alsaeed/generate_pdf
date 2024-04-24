const { createDirectus, rest, uploadFiles } = require('@directus/sdk');

const uploadPdf = async (pdfBuffer, quoteNo) => {
    const client = createDirectus('http://207.244.242.3:8055').with(rest());

    const formData = new FormData();
    formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), `${quoteNo}.pdf`);
    formData.append('title', quoteNo);

    return await client.request(uploadFiles(formData));
};

module.exports = {
    uploadPdf,
};
