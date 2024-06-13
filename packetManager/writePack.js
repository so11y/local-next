const path = require("path");
const fs = require("fs-extra");
const { requireImpl, getTgz } = require("../request");
const {
  getOutlinePath,
  getLocalPath,
  getDayPath,
  hasOutside,
  createWriteStream,
  getEnvironment,
} = require("../share");

const MAX_RETRIES = 5;

class WritePack {
  _writeInfo(packPath, data) {
    return fs.outputFile(path.join(packPath, `package.json`), data);
  }

  writeLocalInfo(packName, data) {
    return this._writeInfo(getLocalPath(packName), data);
  }

  writeOutlineInfo(packName, data) {
    return this._writeInfo(getOutlinePath(packName), data);
  }

  writeTodayInfo(packName, data) {
    return this._writeInfo(getDayPath(packName), data);
  }

  async writeInfo(packageName) {
    const { data: packageInfo } = await requireImpl.get(packageName);
    const { ip } = getEnvironment();
    Object.keys(packageInfo.versions).forEach((version) => {
      packageInfo.versions[
        version
      ].dist.tarball = `${ip}/package/${packageName}/${version}`;
    });
    const jsonPack = JSON.stringify(packageInfo);
    if (!hasOutside(packageName)) {
      this.writeTodayInfo(packageName, jsonPack);
    }
    this.writeOutlineInfo(packageName, jsonPack);
    return jsonPack;
  }

  async writeOutsideTgz(packageName, version) {
    let attempt = 0;
    const { withComplete, createStream, pipe } = createWriteStream();
    const downloadAndCreatePackagePath = async () => {
      while (attempt < MAX_RETRIES) {
        try {
          attempt++;
          const { data } = await requireImpl.get(packageName);
          const { data: downloadData } = await getTgz(
            data.versions[version].dist.tarball
          );
          pipe(downloadData);
          if (!hasOutside(packageName, version)) {
            createStream(getDayPath(path.join(packageName, `${version}.tgz`)));
          }
          const packagePath = getOutlinePath(
            path.join(packageName, `${version}.tgz`)
          );
          createStream(packagePath);
          return packagePath;
        } catch (error) {
          if (attempt >= MAX_RETRIES) {
            return Promise.reject("Package not found");
          }
        }
      }
    };
    const packagePath = await downloadAndCreatePackagePath();
    await withComplete();
    return packagePath;
  }
}

module.exports = WritePack;
