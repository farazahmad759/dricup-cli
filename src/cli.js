import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
import dvGenerators from "./generators/index";
import { readEcagConfigFile } from "./utils/functions";
var fs = require("fs");
var dvCrudConfig = readEcagConfigFile();
var pluralize = require("pluralize");
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
    // rawArgs: rawArgs.slice(2),
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "JavaScript";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["javascript", "typescript"],
      default: defaultTemplate,
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
  };
}
export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  // options = await promptForMissingOptions(options);
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  // #0 copy files
  createProject(options);

  // TODO if ecag.config.js exists in targetDirectory, then read dvCrudConfig from there

  // #1 read all schema files from targetDirectory/db/schemas and return json objects
  let jsonFullContents = [];
  let schemaDirectory = options.targetDirectory + "/db/schemas";
  fs.readdirSync(schemaDirectory).forEach((file, i) => {
    var obj = JSON.parse(fs.readFileSync(schemaDirectory + "/" + file, "utf8"));
    jsonFullContents.push({});
    jsonFullContents[i].schema = obj;
  });
  // #2 create contents
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

  // console.log(jsonFullContents[0].controller);
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

// helper functions
const createFile = (params) => {
  // let dvCrudConfig = {
  //   migrations_path: "migrations/",
  //   models_path: "models/",
  //   controllers_path: "controllers/",
  //   views_path: "views/",
  //   routes_path: "routes/",
  // };
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
