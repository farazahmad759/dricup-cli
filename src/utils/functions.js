import fs from "fs";
import path from "path";
var dvCrudConfig = {};
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
  let filePath = process.cwd() + "/dricup.config.json";
  // TODO if dricup.config.json not exists in cwd(), then create one
  if (fs.existsSync(filePath)) {
    dvCrudConfig = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } else {
    const packagePath = getInstalledPathSync("@dricup/dricup-cli");
    dvCrudConfig = JSON.parse(
      fs.readFileSync(packagePath + "/templates/dricup.config.json", "utf8")
    );
  }
  // console.log(
  //   " ========== dvCrudConfig options object",
  //   dvCrudConfig,
  //   templateDir
  // );
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

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function createDirectoriesIfNotExist(options) {
  let dbDirectory = options.targetDirectory + "/db";
  if (
    dvCrudConfig.migrations_path.includes("server") ||
    dvCrudConfig.models_path.includes("server") ||
    dvCrudConfig.controllers_path.includes("server")
  ) {
    if (!fs.existsSync("server")) {
      fs.mkdirSync("server");
    }
    if (!fs.existsSync("server/db")) {
      fs.mkdirSync("server/db");
    }
  }
  let migrationsDirectory =
    options.targetDirectory + "/" + dvCrudConfig.migrations_path;
  let modelsDirectory =
    options.targetDirectory + "/" + dvCrudConfig.models_path;
  let controllersDirectory =
    options.targetDirectory + "/" + dvCrudConfig.controllers_path;
  if (!fs.existsSync(migrationsDirectory)) {
    fs.mkdirSync(migrationsDirectory);
    console.log("==================== migDirectory created");
  }
  if (!fs.existsSync(modelsDirectory)) {
    fs.mkdirSync(modelsDirectory);
  }
  if (!fs.existsSync(controllersDirectory)) {
    fs.mkdirSync(controllersDirectory);
  }
}

export { dvCrudConfig };
