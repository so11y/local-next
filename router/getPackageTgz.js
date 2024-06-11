async function getPackageTgz(req, res) {
  const { packageName, version } = req.params;
  const { manager } = req;
  try {
    res.sendFile(await manager.getTgz(packageName, version));
  } catch (error) {
    res.status(404).send("Package not found");
  }
}

module.exports = getPackageTgz;
