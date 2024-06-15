const fs = require("fs-extra");
const dotenv = require("dotenv");
const { PACK_DIR } = require("./helper/const");
const { logger } = require("./helper/log");

function setup() {
  const env = process.env.SERVER_ENV || "outside";
  dotenv.config({ path: `.env.${env}` });
  logger.info(`Server is running on ${env} environment`);
  logger.info(`Server host: http://localhost:${process.env.SERVER_PORT}`);
  fs.ensureDirSync(PACK_DIR);
}

module.exports = setup;
