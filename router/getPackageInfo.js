async function getPackageInfo(req, res) {
  const { packageName } = req.params;
  const { manager, logger } = req;
  try {
    const info = await manager.getInfo(packageName);
    logger.success(packageName);
    res.send(info);
  } catch (error) {
    res.status(404).send("Package not found");
  }
}

module.exports = getPackageInfo;
