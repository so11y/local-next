const path = require("path");
const fs = require("fs-extra");
const dayjs = require("dayjs");
const { PassThrough } = require("stream");
const { OUTLINEDIR, LOCALDIR, PACKDIR, isOutside } = require("./const");

function getOutlinePath(_path) {
  return path.join(process.cwd(), PACKDIR, OUTLINEDIR, _path);
}
function getLocalPath(_path) {
  return path.join(process.cwd(), PACKDIR, LOCALDIR, _path);
}
function getDayPath(_path) {
  return path.join(process.cwd(), PACKDIR, dayjs().format("YYYY-MM-DD"), _path);
}

function hasOutside(packageName, version) {
  if (!version) {
    return (
      isOutside() &&
      fs.existsSync(getOutlinePath(path.join(packageName, "package.json")))
    );
  }
  return (
    isOutside() &&
    fs.existsSync(getOutlinePath(path.join(packageName, `${version}.tgz`)))
  );
}

function createWriteStream() {
  const passThrough = new PassThrough();
  function createStream(packagePath) {
    const stream = fs.createWriteStream(packagePath);
    fs.ensureDirSync(path.dirname(packagePath));
    passThrough.pipe(stream);
    return stream;
  }
  function pipe(readStream) {
    readStream.pipe(passThrough);
  }
  return { passThrough, createStream, pipe };
}

module.exports = {
  createWriteStream,
  getOutlinePath,
  getLocalPath,
  getDayPath,
  hasOutside,
};
