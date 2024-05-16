const { createDirectus, rest, uploadFiles, authentication } = require('@directus/sdk');

let client;
let token;

const login = async () => {
    client = createDirectus(process.env.DIRECTUS_ENDPOINT).with(authentication());
    const response = await client.login( process.env.DIRECTUS_EMAIL,process.env.DIRECTUS_PASSWORD);
    console.log(response);
    token = response.access_token;
    
};

const uploadPdf = async (pdfBuffer, quoteNo) => {
    if (!token) {
        await login();
    }

    client = client.with(authentication(token));

    const formData = new FormData();
    formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), `${quoteNo}.pdf`);
    formData.append('title', quoteNo);

    try {
        return await client.request(uploadFiles(formData));
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired, login again
            await login();
            return await client.request(uploadFiles(formData));
        } else {
            throw error;
        }
    }
};

module.exports = {
    uploadPdf,
};
