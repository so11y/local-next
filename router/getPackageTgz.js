const MAX_RETRIES = 5;

async function getPackageTgz(req, res) {
  const { packageName, version } = req.params;
  const { manager } = req;
  console.log(packageName, version, "packagePath");
  let attempt = 0;
  try {
    while (attempt < MAX_RETRIES) {
      attempt++;
      const packInfo = await manager.writeOutsideTgz(packageName, version);
      console.log(packInfo, "1-1-1-");
      res.sendFile(packInfo);
      break;
    }
  } catch (error) {
    console.log(error, "d-d-d-");
    if (attempt >= MAX_RETRIES) {
      res.status(404).send("Package not found");
    }
  }
}

module.exports = getPackageTgz;
