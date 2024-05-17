const { createDirectus } = require('@directus/sdk');
const FormData = require('form-data');
const { Blob } = require('buffer');

let client;
let token;

const login = async () => {
    client = createDirectus(process.env.DIRECTUS_ENDPOINT);
    const response = await client.auth.login({
        email: process.env.DIRECTUS_EMAIL,
        password: process.env.DIRECTUS_PASSWORD
    });
    console.log(response);
    token = response.access_token;
    client.auth.token = token; // Set the token in the client
};

const uploadPdf = async (pdfBuffer, quoteNo) => {
    if (!token) {
        await login();
    }

    const formData = new FormData();
    formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), `${quoteNo}.pdf`);
    formData.append('title', quoteNo);

    try {
        return await client.items('directus_files').createOne(formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired, login again
            await login();
            return await client.items('directus_files').createOne(formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } else {
            throw error;
        }
    }
};

module.exports = {
    uploadPdf,
};
