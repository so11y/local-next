const axios = require("axios");

const TIMEOUT = 5000;
const requireImpl = axios.create({
  baseURL: "https://registry.npmjs.org/",
  timeout: TIMEOUT,
});

function getTgz(tarballUrl) {
  return requireImpl({
    url: tarballUrl,
    method: "GET",
    responseType: "stream",
    timeout: TIMEOUT,
  });
}

module.exports.requireImpl = requireImpl;
module.exports.getTgz = getTgz;
