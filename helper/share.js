const path = require("path");
const fs = require("fs-extra");
const dayjs = require("dayjs");
const { PassThrough } = require("stream");
const { OUTLINE_DIR, LOCAL_DIR, PACK_DIR } = require("./const");

function getOutlinePath(_path = "") {
  return path.join(process.cwd(), PACK_DIR, OUTLINE_DIR, _path);
}
function getLocalPath(_path = "") {
  return path.join(process.cwd(), PACK_DIR, LOCAL_DIR, _path);
}
function getDayPath(_path = "") {
  return path.join(
    process.cwd(),
    PACK_DIR,
    dayjs().format("YYYY-MM-DD"),
    _path
  );
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

function overwriteTarBall(packageInfo) {
  const SERVER_IP = process.env.SERVER_IP;
  Object.keys(packageInfo.versions).forEach((version) => {
    const source = packageInfo.versions[version];
    packageInfo.versions[
      version
    ].dist.tarball = `${SERVER_IP}/package/${source.name}/${version}`;
  });
}

function getTgzPath(packageName, version) {
  const packageNowPath = path.join(packageName, `${version}.tgz`);
  const maybeHaveInsidePackagePath = getLocalPath(packageNowPath);
  const maybeHaveOutsidePackagePath = getOutlinePath(packageNowPath);
  const hasExist = [
    maybeHaveOutsidePackagePath,
    maybeHaveInsidePackagePath,
  ].find(fs.existsSync);
  return [hasExist, maybeHaveOutsidePackagePath, maybeHaveInsidePackagePath];
}

function whereEnvironment(outsideCallback, insideCallback) {
  return isOutside() ? outsideCallback() : insideCallback();
}

function createSymLinkSync(packageName) {
  // const [targetName] = packageName.split(path.sep);
  // const dayPath = getDayPath();
  // const targetPath = getOutlinePath(targetName);
  // if (fs.lstatSync(targetPath).isSymbolicLink()) {
  //   return;
  // }
  // if (!fs.existsSync(dayPath)) {
  //   fs.ensureDirSync(dayPath);
  // }
  // fs.symlinkSync(getOutlinePath(targetName), getDayPath(targetName), "dir");
}
function isOutside() {
  return process.env.SERVER_ENV === "outside";
}

module.exports = {
  createWriteStream,
  getOutlinePath,
  getLocalPath,
  getDayPath,
  hasOutside,
  overwriteTarBall,
  getTgzPath,
  whereEnvironment,
  createSymLinkSync,
  isOutside,
};
