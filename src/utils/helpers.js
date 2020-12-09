import fs from "fs";
import path from "path";
import { promisify } from "util";
import ncp from "ncp";
import chalk from "chalk";
var dvCrudConfig = {};
const copy = promisify(ncp);

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

export async function readSchemaFiles(schemaDirectory, jsonFullContents) {
  fs.readdirSync(schemaDirectory).forEach((file, i) => {
    var obj = JSON.parse(fs.readFileSync(schemaDirectory + "/" + file, "utf8"));
    jsonFullContents.push({});
    jsonFullContents[i].schema = obj;
    jsonFullContents[i].fileName = file;
  });
}

export async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}
export const createFile = (params) => {
  let {
    name,
    type,
    content,
    dir,
    timeStamp,
    preName,
    postName,
    extension,
    _jsonData,
  } = params;
  if (!name) {
    console.error("params.name is required");
    return false;
  }
  if (!type) {
    console.error("params.type is required");
    return false;
  }
  if (!content) {
    content = "";
  }
  if (!dir) {
    dir = "db/";
  }
  if (!timeStamp) {
    timeStamp = "";
  }
  if (!preName) {
    preName = "";
  }
  if (!postName) {
    postName = "";
  }
  if (!extension) {
    extension = ".js";
  }
  if (type === "migration") {
    dir += dvCrudConfig.migrations_path;
  } else if (type === "controller" || type === "api") {
    if (!_jsonData) {
      console.error("_jsonData is required for controllers/apis");
    } else {
      dir += dvCrudConfig.controllers_path;
    }
  } else if (type === "route") {
    dir += dvCrudConfig.routes_path;
  } else if (type === "model") {
    dir += dvCrudConfig.models_path;
  } else if (type === "view") {
    dir += dvCrudConfig.views_path;
  }

  if (dir.includes("server")) {
    if (!fs.existsSync("server")) {
      fs.mkdirSync("server");
    }
    if (!fs.existsSync("server/db")) {
      fs.mkdirSync("server/db");
    }
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let formattedName = "";
  formattedName += timeStamp + "_" + preName + "_" + name + "_" + postName;
  formattedName = formattedName.replace(/_{2}/g, "_");
  if (formattedName.charAt(0) === "_") {
    formattedName = formattedName.substring(1);
  }
  if (formattedName.charAt(formattedName.length - 1) === "_") {
    formattedName = formattedName.slice(0, -1);
  }
  formattedName += extension;
  fs.writeFile(dir + formattedName, content, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(formattedName + " has been created");
    }
  });
};

export const validateDirectories = (dirArray) => {
  let _success = false;
  for (let i = 0; i < dirArray.length; i++) {
    let dir = dirArray[i];
    if (!fs.existsSync(dir)) {
      _success = false;
      throw new Error("schemas directory does not exist.");
      return _success;
    }
    _success = true;
    return _success;
  }
};

export const validateCommand = (options, msgs) => {
  if (!options.all && !options.file) {
    throw new Error(chalk.red(msgs[0]) + chalk.gray(msgs[1]));
  }
};
export { dvCrudConfig };
