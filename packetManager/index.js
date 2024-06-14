const WritePack = require("./writePack");
const ReadPack = require("./readPack");
const { whereEnvironment } = require("../helper/share");

class PackageManager {
  writePack = new WritePack();
  readPack = new ReadPack();
  getInfo(packageName) {
    return whereEnvironment(
      () => this.writePack.writeInfo(packageName),
      () => this.readPack.readInfo(packageName)
    );
  }

  getTgz(packageName, version) {
    return whereEnvironment(
      () => this.writePack.writeOutsideTgz(packageName, version),
      () => this.readPack.readTgz(packageName, version)
    );
  }
}

module.exports = PackageManager;
