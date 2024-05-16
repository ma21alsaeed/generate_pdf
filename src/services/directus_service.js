const { createDirectus, rest, uploadFiles } = require('@directus/sdk');

const uploadPdf = async (pdfBuffer, quoteNo) => {
    const directus = createDirectus(process.env.DIRECTUS_ENDPOINT);
    const client = directus.with(rest());

    // Login with your Directus username and password
    const credentials = {
        email: process.env.DIRECTUS_EMAIL,
        password: process.env.DIRECTUS_PASSWORD
    }
    const response = await directus.auth.login(credentials);
    const token = response.data.access_token;

    // Use the token for subsequent requests
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const formData = new FormData();
    formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), `${quoteNo}.pdf`);
    formData.append('title', quoteNo);

    return await client.request(uploadFiles(formData));
};

module.exports = {
    uploadPdf,
};
