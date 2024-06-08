const WritePack = require("./writePack");
const requireImpl = require("../request");
const path = require("path");
const fs = require("fs-extra");
const { isOutlite } = require("../const");
const { getOutlinePath, getLocalPath, getDayPath } = require("../share");

class PackageManager {
  writePack = new WritePack();
  async writeInfo(packageName) {
    const packData = await requireImpl.get(packageName);
    const jsonPack = JSON.stringify(packData.data);
    if (
      isOutlite() &&
      !fs.existsSync(getOutlinePath(path.join(packageName, "package.json")))
    ) {
      this.writePack.writeTodayInfo(packageName, jsonPack);
    }
    this.writePack.writeOutlineInfo(packageName, jsonPack);

    return jsonPack;
  }
}

module.exports = PackageManager;
