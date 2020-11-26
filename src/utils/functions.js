import fs from "fs";
import path from "path";
export const getRelativePath = (referencePath, otherPath) => {
  let relativePath = path.relative(
    path.dirname(process.cwd() + "/" + otherPath),
    path.dirname(process.cwd() + "/" + referencePath)
  );
  while (relativePath.includes("\\")) {
    relativePath = relativePath.replace("\\", "/");
  }
  relativePath += "/";
  console.log("==================", relativePath); //'../../img'
  return relativePath;
};
const { getInstalledPathSync } = require("get-installed-path");

export const readEcagConfigFile = (templateDir) => {
  let filePath = process.cwd() + "/ecag.config.json";
  var dvCrudConfig = {};
  // TODO if ecag.config.json not exists in cwd(), then create one
  if (fs.existsSync(filePath)) {
    dvCrudConfig = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } else if (templateDir) {
    const packagePath = getInstalledPathSync(
      "@farazahmad759/dricup-crud-express"
    );
    dvCrudConfig = JSON.parse(
      fs.readFileSync(packagePath + "/templates/ecag.config.json", "utf8")
    );
    // console.log(" ===== options object", templateDir);
  }
  return dvCrudConfig;
};

export const updatePackageDotJsonFile = async () => {
  var npmview = require("npmview");
  const editJsonFile = require("edit-json-file");
  let file = editJsonFile(`${process.cwd()}/package.json`);
  // knex js
  npmview("knex", function (err, version, moduleInfo) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("knex Version:", version);
    file.set("dependencies.knex", "^" + version);
    file.save();
  });
  //   objection js
  npmview("objection", function (err, version, moduleInfo) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("objection Version:", version);
    file.set("dependencies.objection", "^" + version);
    file.save();
  });
  // mysql
  npmview("mysql", function (err, version, moduleInfo) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("mysql Version:", version);
    file.set("dependencies.mysql", "^" + version);
    file.save();
  });
};
