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
  //TODO: 还是需要监听文件流写入完成的事件
  const passThrough = new PassThrough();
  const fsStreams = [];
  function createStream(packagePath) {
    const stream = fs.createWriteStream(packagePath);
    fs.ensureDirSync(path.dirname(packagePath));
    passThrough.pipe(stream);
    fsStreams.push(stream);
    return stream;
  }
  function pipe(readStream) {
    readStream.pipe(passThrough);
  }
  function withComplete() {
    return Promise.all(
      fsStreams.map((steam) => {
        return new Promise((resolve, reject) => {
          steam.on("finish", resolve);
          steam.on("error", reject);
        });
      })
    );
  }
  return { passThrough, createStream, pipe, withComplete };
}

function getEnvironment() {
  if (isOutside()) {
    return {
      ip: "http://localhost:4873",
    };
  }
  return {
    ip: "http://localhost:4873",
  };
}

module.exports = {
  createWriteStream,
  getOutlinePath,
  getLocalPath,
  getDayPath,
  hasOutside,
  getEnvironment,
};
