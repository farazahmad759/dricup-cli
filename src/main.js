import chalk from "chalk";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import {
  readSchemaFiles,
  copyTemplateFiles,
  createFile,
  capitalizeFirstLetter,
  validateDirectories,
} from "./utils/helpers";
var pluralize = require("pluralize");

const createMigrations = async (options, jsonData) => {
  const tasks = new Listr([
    {
      title: "Checking schemas directory",
      task: () => {
        validateDirectories(["dricup/schemas"]);
      },
    },
    {
      title: "Generating migrations",
      task: () => _createMigrations(options, jsonData),
    },
  ]);

  await tasks.run();
  console.log("%s Migrations created", chalk.green.bold("DONE"));
  return true;
};
const createModels = async (options, jsonData) => {
  const tasks = new Listr([
    {
      title: "Creating models",
      task: () => _createModels(options, jsonData),
    },
  ]);

  await tasks.run();
  console.log("%s Models created", chalk.green.bold("DONE"));
  return true;
};
const createControllers = async (options, jsonData) => {
  const tasks = new Listr([
    {
      title: "Generating Controllers",
      task: () => _createControllers(options, jsonData),
    },
  ]);

  await tasks.run();
  console.log("%s Controllers created", chalk.green.bold("DONE"));
  return true;
};
const createRoutes = async (options, jsonData) => {
  const tasks = new Listr([
    {
      title: "Generating Controllers",
      task: () => _createRoutes(options, jsonData),
    },
  ]);

  await tasks.run();
  console.log("%s Controllers created", chalk.green.bold("DONE"));
  return true;
};
const createCRUD = async (options, jsonData) => {
  const tasks = new Listr([
    {
      title: "Generating Migrations",
      task: () => _createMigrations(options, jsonData),
    },
    {
      title: "Generating Models",
      task: () => _createModels(options, jsonData),
    },
    {
      title: "Generating Controllers",
      task: () => _createControllers(options, jsonData),
    },
    {
      title: "Generating Routes",
      task: () => _createRoutes(options, jsonData),
    },
  ]);

  await tasks.run();
  console.log("%s CRUD created", chalk.green.bold("DONE"));
  return true;
};
const createProject = async (options, jsonData) => {
  const tasks = new Listr([
    {
      title: "Generating files",
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
  console.log("%s Project created", chalk.green.bold("DONE"));
  return true;
};

export {
  createMigrations,
  createModels,
  createControllers,
  createRoutes,
  createCRUD,
  createProject,
};

function _createMigrations(options, jsonData) {
  jsonData.forEach((_content) => {
    if (options.all) {
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
    } else if (options.file && options.file === _content.fileName) {
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
    } else {
      console.log(
        "%s",
        chalk.red(
          "Error: Incomplete command. The following commands are supported \n"
        )
      );
      console.log("%s", chalk.grey("--create:crud --all\n"));
      console.log(
        "%s",
        chalk.grey('--create:crud --file="your_schema.json"\n')
      );
    }
  });
}

const _createModels = async (options, jsonData) => {
  let content_models_index_js = ``;
  let modelNamesObj = {};
  jsonData.forEach((_content) => {
    if (options.all) {
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
    } else if (options.file && options.file === _content.fileName) {
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
    }
    let modelName = pluralize.singular(_content.schema.tableName);
    modelName = capitalizeFirstLetter(modelName);
    content_models_index_js += `\nvar ${modelName} = require('./${_content.schema.tableName}')`;
    modelNamesObj[modelName] = modelName;
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
};
const _createControllers = async (options, jsonData) => {
  jsonData.forEach((_content) => {
    if (options.all) {
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
    } else if (options.file && options.file === _content.fileName) {
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
    }
  });
};
const _createRoutes = async (options, jsonData) => {
  let content_models_index_js = ``;
  let content_models_register = ``;
  let modelNamesObj = {};
  jsonData.forEach((_content) => {
    if (options.all) {
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
    } else if (options.file && options.file === _content.fileName) {
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
    }
    let modelName = _content.schema.tableName + "Router";
    content_models_index_js += `\nvar ${modelName} = require('./${_content.schema.tableName}')`;
    let _route = _content.schema.route
      ? _content.schema.route + "/" + _content.schema.tableName
      : "/" + _content.schema.tableName;
    content_models_register += `\napp.use('${_route}', ${modelName})`;
    modelNamesObj[modelName] = modelName;
  });
  let _options = {
    templateDirectory: options.templateDirectory + "/bootstrap/routes",
    targetDirectory: options.targetDirectory + "/routes",
  };
  copyTemplateFiles(_options);
  let modelName = "indexRouter";
  content_models_index_js += `\nvar ${modelName} = require('./index')`;
  content_models_register += `\napp.use('/', ${modelName})`;
  modelNamesObj[modelName] = modelName;
  fs.writeFile(
    "routes/routes.js",
    `
    ${content_models_index_js}
    function register(app) {
      ${content_models_register}
    }
    let exp = {
      register
    }
    module.exports = exp;
    `,
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("models/index.js" + " has been created");
      }
    }
  );
};
