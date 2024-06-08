const path = require("path");
const { OUTLINEDIR, LOCALDIR, PACKDIR } = require("./const");
function getOutlinePath(_path) {
  return path.join(process.cwd(), PACKDIR, OUTLINEDIR, _path);
}
function getLocalPath(_path) {
  return path.join(process.cwd(), PACKDIR, LOCALDIR, _path);
}
function getDayPath(day, _path) {
  return path.join(process.cwd(), PACKDIR, day, _path);
}

module.exports = {
  getOutlinePath,
  getLocalPath,
  getDayPath,
};
