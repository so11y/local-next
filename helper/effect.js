const { PassThrough } = require("stream");
const { logger } = require("./log");
const path = require("path");
const fs = require("fs-extra");
const { getDayPath, getOutlinePath } = require("./share");

function createWriteStream() {
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

function createSymLinkSync(packageName) {
  const [targetName] = packageName.split(path.sep);
  const dayPath = getDayPath();
  const linkPath = getDayPath(targetName);
  if (fs.lstatSync(linkPath).isSymbolicLink()) {
    return;
  }
  if (!fs.existsSync(dayPath)) {
    fs.ensureDirSync(dayPath);
  }
  try {
    fs.symlinkSync(getOutlinePath(targetName), linkPath, "dir");
  } catch (error) {
    logger.internalError(`createSymLinkSync error: ${error}`);
  }
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

module.exports = {
  createWriteStream,
  createSymLinkSync,
  overwriteTarBall,
};
