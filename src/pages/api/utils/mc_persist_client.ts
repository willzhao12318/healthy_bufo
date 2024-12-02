const axios = require("axios").default;
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

function createClient() {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ timeout: 5000, jar, withCredentials: true }));
  return client;
}

const mcClient = createClient();

exports.mcClient = mcClient;
