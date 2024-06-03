const { createDirectus, authentication, rest, uploadFiles } = require('@directus/sdk');

const email = process.env.DIRECTUS_EMAIL;
const password = process.env.DIRECTUS_PASSWORD;
const endpoint = process.env.DIRECTUS_ENDPOINT;

const client = createDirectus(endpoint).with(authentication()).with(rest());

let access_token;
const login = async () => {
  try {
    const response = await client.login(
        email.toString(),
        password.toString(),
    );
    access_token = response.access_token;
    await client.setToken(access_token);
  } catch (error) {
    console.error('Error:', error);
  }
};

const validateToken = async () => {
  if (!access_token) {
    await login();
  } else {
    try {
      // Assuming there's a method to validate the token
     // const isValid = await client.validateToken(access_token);
   /*   if (!isValid) {
        await login();*/
      }
     catch (error) {
      console.error('Error:', error);
      await login();
    }
  }
};

const uploadPdf = async (pdfBuffer, quoteNo) => {
    await validateToken();
    
    const formData = new FormData();
    formData.append('folder', '0d276ea6-f5ae-4296-9f5b-32ce04840c34');
    formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), `${quoteNo}.pdf`);
    formData.append('title', quoteNo);
    

    return await client.request(uploadFiles(formData));
};

module.exports = {
  uploadPdf
};