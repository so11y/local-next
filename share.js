const path = require("path");
const dayjs = require("dayjs");
const { OUTLINEDIR, LOCALDIR, PACKDIR } = require("./const");
function getOutlinePath(_path) {
  return path.join(process.cwd(), PACKDIR, OUTLINEDIR, _path);
}
function getLocalPath(_path) {
  return path.join(process.cwd(), PACKDIR, LOCALDIR, _path);
}
function getDayPath(_path) {
  return path.join(process.cwd(), PACKDIR, dayjs().format("YYYY-MM-DD"), _path);
}

module.exports = {
  getOutlinePath,
  getLocalPath,
  getDayPath,
};
