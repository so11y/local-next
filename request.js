const axios = require("axios");

const requireImpl = axios.create({
  baseURL: "https://registry.npmjs.org/",
  timeout: 10000,
});

module.exports = requireImpl;
