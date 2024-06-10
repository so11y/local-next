const path = require("path");
const fs = require("fs-extra");
const { LOCALDIR, OUTLINEDIR } = require("../const");
const { getOutlinePath, getLocalPath, getDayPath } = require("../share");
const dayjs = require("dayjs");

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

  writeTgz(packPath, version) {
    return fs.outputFile(path.join(packPath, `${version}.tgz`), data);
  }
}

module.exports = WritePack;
