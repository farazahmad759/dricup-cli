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
  validateCommand,
} from "./utils/helpers";
const { Observable } = require("rxjs");
var pluralize = require("pluralize");

const createMigrations = async (options, jsonData) => {
  const tasks = new Listr(
    [
      {
        title: "Checking command",
        task: () => {
          validateCommand(options, [
            "Incomplete command. Supported commands:\n",
            '--create:migrations --all\n--create:migrations --file="your_schema_file.json"',
          ]);
        },
      },
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
    ],
    { exitOnError: true }
  );

  await tasks.run();
  console.log("%s Migrations created", chalk.green.bold("DONE"));
  return true;
};
const createModels = async (options, jsonData) => {
  const tasks = new Listr([
    {
      title: "Checking command",
      task: () => {
        validateCommand(options, [
          "Incomplete command. Supported commands:\n",
          '--create:models --all\n--create:models --file="your_schema_file.json"',
        ]);
      },
    },
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
      title: "Checking command",
      task: () => {
        validateCommand(options, [
          "Incomplete command. Supported commands:\n",
          '--create:controllers --all\n--create:controllers --file="your_schema_file.json"',
        ]);
      },
    },
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
      title: "Checking command",
      task: () => {
        validateCommand(options, [
          "Incomplete command. Supported commands:\n",
          '--create:routes --all\n--create:routes --file="your_schema_file.json"',
        ]);
      },
    },
    {
      title: "Generating Routes",
      task: () => _createRoutes(options, jsonData),
    },
  ]);

  await tasks.run();
  console.log("%s Routes created", chalk.green.bold("DONE"));
  return true;
};
const createCRUD = async (options, jsonData) => {
  const tasks = new Listr([
    {
      title: "Checking command",
      task: () => {
        validateCommand(options, [
          "Incomplete command. Supported commands:\n",
          '--create:crud --all\n--create:crud --file="your_schema_file.json"',
        ]);
      },
    },
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
    {
      title: "Generating CRUD",
      task: async () => {
        await execa.command("dricup --create:crud --all");
      },
    },
  ]);

  await tasks.run();
  console.log("%s Project created", chalk.green.bold("DONE"));
  return true;
};

const createFrontend = async (options) => {
  let _clientJs = require(options.targetDirectory + "/client/client");
  let _clientJsApps = _clientJs.apps;
  if (!options.path) {
    options.path = "client/app-1";
  }
  const tasks = new Listr([
    {
      title:
        "Creating files. It may take several minutes depending on your network",
      task: () => {
        let _supportedFrameworks = {
          react: {
            cli: null,
            bootstrap: "npx create-react-app" + " " + options.path,
          },
          vue: {
            cli: "npm install -g @vue/cli @vue/cli-service-global ",
            bootstrap: "vue create" + " " + options.path + " -d",
          },
          static: {
            cli: null,
            bootstrap: "mkdir" + " " + options.path,
          },
        };
        return new Observable(async (observer) => {
          observer.next(
            'Running "' + _supportedFrameworks[options.framework].cli + '"'
          );
          if (
            _supportedFrameworks[options.framework].cli &&
            options.frameworkCli === "true"
          ) {
            const { stdout } = await execa.command(
              _supportedFrameworks[options.framework].cli
            );
          }
          observer.next(
            'Running "' +
              _supportedFrameworks[options.framework].bootstrap +
              '"'
          );
          if (_supportedFrameworks[options.framework].bootstrap) {
            const { stdout } = await execa.command(
              _supportedFrameworks[options.framework].bootstrap,
              { cwd: "client" }
            );
          }
          if (options.framework === "static") {
            console.log(options.targetDirectory);
            let _options = {
              templateDirectory:
                options.templateDirectory + "/bootstrap/client/app-1",
              targetDirectory:
                options.targetDirectory + "/client/" + options.path,
            };
            copyTemplateFiles(_options);
          }
          _clientJsApps[options.path] = {
            framework: options.framework,
            route: "/" + options.path,
          };
          observer.complete();
        });
      },
    },
    {
      title: "Updating app.js",
      task: () => {
        const getDirectories = (source) => {
          return fs
            .readdirSync(source, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
        };
        let directories = getDirectories(options.targetDirectory + "/client");

        // create client.js file
        let _clientJsContent = ``;
        _clientJsContent += `
        var express = require("express");
        var path = require("path");`;

        console.log(_clientJsApps);
        _clientJsContent += `
          let apps = {`;
        Object.keys(_clientJsApps).forEach((key) => {
          _clientJsContent += `
          "${key}": {
            framework: "${_clientJsApps[key].framework}",
            route: "${_clientJsApps[key].route}"
          },
          `;
        });
        _clientJsContent += `}
        `;

        _clientJsContent += `
        function register(app) {
        `;
        directories.forEach((dir) => {
          _clientJsContent += `
          /**
           * APP ${dir}
           */
          if (process.env.NODE_ENV === "production") {
            app.use(
              express.static(path.join(__dirname, "/${dir}/build"))
            );
            app.get("/${dir}", function (req, res) {
              res.sendFile(
                path.join(__dirname, "/${dir}/build", "index.html")
              );
            });
          }
          else {
            app.get("/${dir}", function (req, res) {`;

          if (options.framework === "static") {
            _clientJsContent += `
                  res.sendFile(
                    path.join(__dirname, "/${dir}/build", "index.html")
                  );
                });
              }`;
          } else {
            _clientJsContent += `
            res.send({
                  message: "Running development environment",
                });
              });
            }
            `;
          }
        });
        _clientJsContent += `
          }

          let exp = {
            register,
            apps
          }
          module.exports = exp;
      `;
        // console.log(_clientJsContent);
        fs.writeFile(
          "client/client.js",
          `
          ${_clientJsContent}
          `,
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("client/client.js" + " has been created");
            }
          }
        );
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
  createFrontend,
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
