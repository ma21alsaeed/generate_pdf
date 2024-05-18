
const { createDirectus, authentication } = require('@directus/sdk');

const email = process.env.DIRECTUS_EMAIL;
const password = process.env.DIRECTUS_PASSWORD;
const endpoint = process.env.DIRECTUS_ENDPOINT;

const directus = createDirectus(endpoint);
const auth = authentication(directus);

const login = async () => {
  try {
    const response = await auth.login({
      email: email,
      password: password,
    });
    console.log('Access token:', response.access_token);
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = {
  login,
};
