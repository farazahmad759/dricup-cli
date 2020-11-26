import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import { updatePackageDotJsonFile } from "./utils/functions";
import dvGenerators from "./generators/index";
import { readEcagConfigFile } from "./utils/functions";
var dvCrudConfig = {};
var pluralize = require("pluralize");

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function createDirectoriesIfNotExist(options) {
  let migrationsDirectory = options.targetDirectory + "/db/migrations";
  let modelsDirectory = options.targetDirectory + "/db/models";
  let controllersDirectory = options.targetDirectory + "/db/controllers";
  if (!fs.existsSync(migrationsDirectory)) {
    fs.mkdirSync(migrationsDirectory);
  }
  if (!fs.existsSync(modelsDirectory)) {
    fs.mkdirSync(modelsDirectory);
  }
  if (!fs.existsSync(controllersDirectory)) {
    fs.mkdirSync(controllersDirectory);
  }
}

async function readSchemaFiles(options, jsonFullContents) {
  let schemaDirectory = options.targetDirectory + "/db/schemas";
  fs.readdirSync(schemaDirectory).forEach((file, i) => {
    var obj = JSON.parse(fs.readFileSync(schemaDirectory + "/" + file, "utf8"));
    jsonFullContents.push({});
    jsonFullContents[i].schema = obj;
  });
}

async function generateContentFromSchemaFiles(options, jsonFullContents) {
  jsonFullContents.forEach((_content, i) => {
    // migration content
    let _mig = dvGenerators.dvMigrations.buildContent({
      jsonData: _content.schema,
    });
    jsonFullContents[i].migration = _mig;
    // model content
    let _model = dvGenerators.dvModels.buildContent({
      jsonData: _content.schema,
    });
    jsonFullContents[i].model = _model;
    // controller content
    let _controller = dvGenerators.dvControllers.buildContent({
      jsonData: _content.schema,
    });
    jsonFullContents[i].controller = _controller;
    // route content
    let _route = dvGenerators.dvRoutes.buildContent({
      jsonData: _content.schema,
    });
    jsonFullContents[i].route = _route;
  });
}

async function createFilesFromContent(options, jsonFullContents) {
  let content_models_index_js = ``;
  let modelNamesObj = {};
  // #3 create files
  jsonFullContents.forEach((_content) => {
    console.log("=======", _content.schema.tableName);
    // migration files
    createFile({
      name: _content.schema.tableName,
      type: "migration",
      content: _content.migration,
      dir: options.targetDirectory + "/",
      preName: "create_table",
      postName: "",
      extension: ".js",
      _jsonData: {},
    });
    // model files
    createFile({
      name: _content.schema.tableName,
      type: "model",
      content: _content.model,
      dir: options.targetDirectory + "/",
      preName: "",
      postName: "",
      extension: ".js",
      _jsonData: {},
    });
    // models/index.js
    let modelName = pluralize.singular(_content.schema.tableName);
    modelName = capitalizeFirstLetter(modelName);
    content_models_index_js += `\nvar ${modelName} = require('./${_content.schema.tableName}')`;
    modelNamesObj[modelName] = modelName;
    // controller files
    createFile({
      name: _content.schema.tableName,
      type: "controller",
      content: _content.controller,
      dir: options.targetDirectory + "/",
      preName: "",
      postName: "",
      extension: ".js",
      _jsonData: _content.controller,
    });
    // route files
    createFile({
      name: _content.schema.tableName,
      type: "route",
      content: _content.route,
      dir: options.targetDirectory + "/",
      preName: "",
      postName: "",
      extension: ".js",
      _jsonData: _content.route,
    });

    // view files
  });

  console.log("========== modelNamesObject =======", modelNamesObj);
  fs.writeFile(
    "db/models/index.js",
    `
    ${content_models_index_js}
    let models = {
      ${Object.keys(modelNamesObj)}
    }
    module.exports = models;
    `,
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("db/models/index.js" + " has been created");
      }
    }
  );
}

async function initGit(options) {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const templateDir = path.resolve(
    new URL(import.meta.url).pathname,
    "../../templates",
    ""
  );
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name" + err, chalk.red.bold("ERROR"));
    process.exit(1);
  }

  // variable
  let jsonFullContents = [];

  // update package.json
  // create directories
  // copy template files (if not already exist)
  // read schema files
  // generate contents from schema files
  // create files into respective directories
  // install dependencies
  const tasks = new Listr([
    {
      title: "Update package.json",
      task: () => updatePackageDotJsonFile(),
    },
    {
      title: "Create necessary directories",
      task: () => createDirectoriesIfNotExist(options),
    },
    {
      title: "Copy project files",
      task: () => {
        copyTemplateFiles(options);
        dvCrudConfig = readEcagConfigFile();
      },
    },
    {
      title: "Read schema files",
      task: () => readSchemaFiles(options, jsonFullContents),
    },
    {
      title: "Generate content from schema files",
      task: () => generateContentFromSchemaFiles(options, jsonFullContents),
    },
    {
      title: "Create fiels from content",
      task: () => createFilesFromContent(options, jsonFullContents),
    },
    {
      title: "Initialize git",
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.runInstall
          ? "Pass --install to automatically install dependencies"
          : undefined,
    },
  ]);

  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}

const createFile = (params) => {
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
