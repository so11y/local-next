async function getTgz(packageName, version, manager, res) {
  try {
    res.sendFile(await manager.getTgz(packageName, version));
  } catch (error) {
    res.status(404).send("Package not found");
  }
}

function getPackageTgz(req, res) {
  const { packageName, version } = req.params;
  const { manager } = req;
  getTgz(packageName, version, manager, res);
}
async function getScopePackageTgz(req, res) {
  const { scope, packageName, version } = req.params;
  const { manager } = req;
  getTgz(`${scope}/${packageName}`, version, manager, res);
}

module.exports = {
  getScopePackageTgz,
  getPackageTgz,
};
