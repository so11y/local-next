const path = require("path");
const fs = require("fs-extra");
const { requireImpl, getTgz } = require("../helper/request");
const { logger } = require("../helper/log");
const { MAX_RETRIES } = require("../helper/const");
const {
  getOutlinePath,
  getLocalPath,
  getDayPath,
  hasOutside,
  createWriteStream,
  overwriteTarBall,
  getTgzPath,
  createSymLinkSync,
} = require("../helper/share");

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
    overwriteTarBall(packageInfo);
    const jsonInfo = JSON.stringify(packageInfo);
    const hasCache = hasOutside(packageName);
    await this.writeOutlineInfo(packageName, jsonInfo);
    if (!hasCache) {
      createSymLinkSync(packageName);
    }
    return jsonInfo;
  }

  async writeOutsideTgz(packageName, version) {
    let attempt = 0;
    const { withComplete, createStream, pipe } = createWriteStream();
    const [hasExist, maybeHaveOutsidePackagePath] = getTgzPath(
      packageName,
      version
    );
    if (hasExist) {
      logger.success(`Tgz cache: ${packageName}/${version}.tgz`);
      return hasExist;
    }
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
            createSymLinkSync(packageName);
          }
          createStream(maybeHaveOutsidePackagePath);
          return maybeHaveOutsidePackagePath;
        } catch (error) {
          if (attempt >= MAX_RETRIES) {
            logger.error(`Download tgz: ${error.message}`);
            return Promise.reject("Package not found");
          }
        }
      }
    };
    const selfPackagePath = await downloadAndCreatePackagePath();
    await withComplete();
    return selfPackagePath;
  }
}

module.exports = WritePack;
