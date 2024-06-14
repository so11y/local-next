const axios = require("axios");
const { logger } = require("./log");

const TIMEOUT = 5000;
const requireImpl = axios.create({
  baseURL: "https://registry.npmjs.org/",
  timeout: TIMEOUT,
});

// requireImpl.interceptors.response.use(
//   (v) => v,
//   (e) => {
//     return Promise.reject(e);
//   }
// );

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
