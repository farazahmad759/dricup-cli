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
      task: () => {
        jsonData.forEach((_content) => {
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
      },
    },
  ]);

  await tasks.run();
  console.log("%s Migrations created", chalk.green.bold("DONE"));
  return true;
};
const createModels = async (options, jsonData) => {
  let content_models_index_js = ``;
  let modelNamesObj = {};
  const tasks = new Listr([
    {
      title: "Creating models",
      task: () => {
        jsonData.forEach((_content) => {
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
      },
    },
    {
      title: "Creating index.js",
      task: () => {
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
      },
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
      task: () => {
        jsonData.forEach((_content) => {
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
      },
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
      task: () => {
        jsonData.forEach((_content) => {
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
      },
    },
  ]);

  await tasks.run();
  console.log("%s Controllers created", chalk.green.bold("DONE"));
  return true;
};
const createCRUD = async (options, jsonData) => {
  createMigrations(options, jsonData);
  createModels(options, jsonData);
  createControllers(options, jsonData);
  createRoutes(options, jsonData);
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
