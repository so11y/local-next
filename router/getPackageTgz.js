async function getTgz(packageName, version, req, res) {
  const { manager, logger } = req;
  try {
    const path = await manager.getTgz(packageName, version);
    logger.success(`${packageName}/${version}.tgz`);
    res.sendFile(path);
  } catch (error) {
    console.error(error);
    res.status(404).send("Package not found");
  }
}

function getPackageTgz(req, res) {
  const { packageName, version } = req.params;
  getTgz(packageName, version, req, res);
}
async function getScopePackageTgz(req, res) {
  const { scope, packageName, version } = req.params;
  getTgz(`${scope}/${packageName}`, version, req, res);
}

module.exports = {
  getScopePackageTgz,
  getPackageTgz,
};
