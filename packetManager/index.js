const WritePack = require("./writePack");
const { requireImpl, getTgz } = require("../request");
const path = require("path");
const fs = require("fs-extra");
const { isOutside } = require("../const");
const { PassThrough } = require("stream");
const { getOutlinePath, getLocalPath, getDayPath } = require("../share");

function createWriteStream() {
  const passThrough = new PassThrough();
  function createStream(packagePath) {
    const stream = fs.createWriteStream(packagePath);
    fs.ensureDirSync(path.dirname(packagePath));
    passThrough.pipe(stream);
    return stream;
  }
  return { passThrough, createStream };
}

class PackageManager {
  writePack = new WritePack();
  async writeInfo(packageName) {
    const packData = await requireImpl.get(packageName);
    const packageInfo = packData.data;
    Object.keys(packageInfo.versions).forEach((version) => {
      packageInfo.versions[
        version
      ].dist.tarball = `http://localhost:4873/package/${packageName}/${version}`;
    });
    const jsonPack = JSON.stringify(packageInfo);
    if (!this.hasOutside(packageName)) {
      this.writePack.writeTodayInfo(packageName, jsonPack);
    }
    this.writePack.writeOutlineInfo(packageName, jsonPack);

    return jsonPack;
  }

  async writeOutsideTgz(packageName, version) {
    const { data } = await requireImpl.get(packageName);
    const downloadData = await getTgz(data.versions[version].dist.tarball);

    const { passThrough, createStream } = createWriteStream();
    if (!this.hasOutside(packageName, version)) {
      createStream(getDayPath(path.join(packageName, `${version}.tgz`)));
    }
    const packagePath = getOutlinePath(
      path.join(packageName, `${version}.tgz`)
    );
    createStream(packagePath);
    downloadData.data.pipe(passThrough);
    console.log(packagePath, "---packagePath");

    await new Promise((resolve, reject) => {
      downloadData.data.on("finish", () => {
        passThrough.end();
        resolve(packagePath);
      });
      downloadData.data.on("error", () => {
        passThrough.end();
        reject();
      });
    });
  }

  hasOutside(packageName, version) {
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
}

module.exports = PackageManager;
