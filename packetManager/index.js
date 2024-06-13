const WritePack = require("./writePack");
const { isOutside } = require("../const");

class PackageManager {
  writePack = new WritePack();
  async getInfo(packageName) {
    if (isOutside()) {
      return await this.writePack.writeInfo(packageName);
    }
    //TODO inside
  }

  async getTgz(packageName, version) {
    return await this.writePack.writeOutsideTgz(packageName, version);
  }
}

module.exports = PackageManager;
