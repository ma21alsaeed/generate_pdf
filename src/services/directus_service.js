
const { createDirectus, authentication } = require('@directus/sdk');

const email = process.env.DIRECTUS_EMAIL;
const password = process.env.DIRECTUS_PASSWORD;
const endpoint = process.env.DIRECTUS_ENDPOINT;

const client = createDirectus(endpoint).with(authentication());;

console.log(email);
console.log(password);
console.log(endpoint);
const login = async () => {
  try {
    const response = await client.login({
      email: email.toString(),
      password: password.toString(),
    });
    console.log('Access token:', response.access_token);
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = {
  login,
};
