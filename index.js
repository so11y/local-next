const express = require("express");
const setup = require("./setup");
const getPackageInfo = require("./router/getPackageInfo");
const { getPackageTgz, getScopePackageTgz } = require("./router/getPackageTgz");
const packageManager = require("./packetManager");
const { createLog } = require("./helper/log");

const app = express();

const manager = new packageManager();

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use((req, _res, next) => {
  req.manager = manager;
  next();
});
app.use(createLog);

app.get("/:packageName", getPackageInfo);
app.get("/package/:packageName/:version", getPackageTgz);
app.get("/package/:scope/:packageName/:version", getScopePackageTgz);

app.listen(process.env.SERVER_PORT, setup);
