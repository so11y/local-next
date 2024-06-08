const fs = require("fs-extra");
const { PACKDIR } = require("./const");

function setup() {
  fs.ensureDirSync(PACKDIR);
}

module.exports = setup;
