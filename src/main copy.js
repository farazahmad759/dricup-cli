import chalk from "chalk";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import {
  updatePackageDotJsonFile,
  capitalizeFirstLetter,
  createDirectoriesIfNotExist,
  readEcagConfigFile,
  dvCrudConfig,
  readSchemaFiles,
  copyTemplateFiles,
} from "./utils/helpers";
import dvGenerators from "./generators/index";
var pluralize = require("pluralize");

const access = promisify(fs.access);

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

  // console.log("========== modelNamesObject =======", modelNamesObj);
  fs.writeFile(
    "models/index.js",
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
        console.log("models/index.js" + " has been created");
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

export async function createMigrations(options, jsonFullContents) {
  jsonFullContents.forEach((_content) => {
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
  });
}

export async function createModels(options, jsonFullContents) {
  jsonFullContents.forEach((_content) => {
    let content_models_index_js = ``;
    let modelNamesObj = {};
    // #3 create files
    jsonFullContents.forEach((_content) => {
      console.log("=======", _content.schema.tableName);
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
      let modelName = pluralize.singular(_content.schema.tableName);
      modelName = capitalizeFirstLetter(modelName);
      content_models_index_js += `\nvar ${modelName} = require('./${_content.schema.tableName}')`;
      modelNamesObj[modelName] = modelName;
    });
  });
  fs.writeFile(
    "models/index.js",
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
        console.log("models/index.js" + " has been created");
      }
    }
  );
}

export async function createControllers(options, jsonFullContents) {
  jsonFullContents.forEach((_content) => {
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
  });
}
export async function createRoutes(options, jsonFullContents) {
  jsonFullContents.forEach((_content) => {
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
  });
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

  const tasks = new Listr([
    {
      title: "Creating project files",
      task: () => {
        let _options = {
          templateDirectory: options.templateDirectory + "/bootstrap",
          targetDirectory: options.targetDirectory,
        };
        copyTemplateFiles(_options);
      },
    },
  ]);

  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}
export async function createCRUD(options) {
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
      title: "Create dricup.config.json if not present",
      task: () => {
        dvCrudConfig = readEcagConfigFile(options.templateDir);
      },
    },
    {
      title: "Create necessary directories",
      task: () => {
        createDirectoriesIfNotExist(options);
      },
    },
    {
      title: "Copy project files",
      task: () => {
        let _dirs = {
          templateDirectory: options.templateDirectory + "/bootstrap",
          targetDirectory: options.targetDirectory,
        };
        copyTemplateFiles(_dirs);
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
      title: "Create files from content",
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
export async function createCRUDNew(options) {
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
  const tasks = new Listr([
    {
      title: "Copy project files",
      task: () => {
        let _dirs = {
          templateDirectory: options.templateDirectory + "/bootstrap",
          targetDirectory: options.targetDirectory,
        };
        copyTemplateFiles(_dirs);
        dvCrudConfig = readEcagConfigFile();
      },
    },
  ]);

  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}
