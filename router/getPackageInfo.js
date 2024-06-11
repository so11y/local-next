async function getPackageInfo(req, res) {
  const { packageName } = req.params;
  const { manager } = req;
  try {
    res.send(await manager.getInfo(packageName));
  } catch (error) {
    res.status(404).send("Package not found");
  }
}

module.exports = getPackageInfo;
