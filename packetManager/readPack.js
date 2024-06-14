const {
  getOutlinePath,
  overwriteTarBall,
  getTgzPath,
} = require("../helper/share");

class ReadPack {
  readInfo(packageName) {
    const maybeHaveOutsidePackagePath = getOutlinePath(
      path.join(packageName, "package.json")
    );
    if (!fs.existsSync(maybeHaveOutsidePackagePath)) {
      throw new Error("package not found");
    }
    const packageInfo = fs.readFileSync(maybeHaveOutsidePackagePath, "utf-8");
    overwriteTarBall(packageInfo);
    return JSON.stringify(packageInfo);
  }

  readTgz(packageName, version) {
    const [hasExist] = getTgzPath(packageName, version);
    if (hasExist) {
      return hasExist;
    }
    throw new Error("package not found");
  }
}

module.exports = ReadPack;
