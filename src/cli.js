import arg from "arg";
import inquirer from "inquirer";
import path from "path";
import { readSchemaFiles } from "./utils/helpers";
import { generateContentFromSchemaFiles } from "./utils/functions";
import {
  createMigrations,
  createModels,
  createControllers,
  createRoutes,
  createCRUD,
  createProject,
} from "./main";
const { getInstalledPathSync } = require("get-installed-path");

var fs = require("fs");
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "--create:project": Boolean,
      "--create:crud": Boolean,
      "--create:migrations": Boolean,
      "--create:models": Boolean,
      "--create:controllers": Boolean,
      "--create:routes": Boolean,
      "--create:views": Boolean,
      "--all": Boolean,
      "--force": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
      "-a": "--all",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  console.log(args);
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
    createMigrations: args["--create:migrations"] || false,
    createModels: args["--create:models"] || false,
    createControllers: args["--create:controllers"] || false,
    createRoutes: args["--create:routes"] || false,
    createCRUD: args["--create:crud"] || false,
    createProject: args["--create:project"] || false,
    all: args["--all"] || false,
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
  let jsonFullContents = [];
  let dvCrudConfig = {};
  const packagePath = getInstalledPathSync("@dricup/dricup-cli");
  dvCrudConfig = JSON.parse(
    fs.readFileSync(packagePath + "/templates/dricup.config.json", "utf8")
  );

  let options = parseArgumentsIntoOptions(args);
  // options = await promptForMissingOptions(options);
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

  // console.log("args", options);
  if (options.createProject) {
    createProject(options, []);
    console.log("--create:project");
  } else {
    readSchemaFiles(
      options.targetDirectory + "/" + dvCrudConfig.paths.schemas,
      jsonFullContents
    );
    generateContentFromSchemaFiles({ dvCrudConfig }, jsonFullContents);

    if (options.createMigrations) {
      createMigrations(options, jsonFullContents);
    } else if (options.createModels) {
      createModels(options, jsonFullContents);
    } else if (options.createControllers) {
      createControllers(options, jsonFullContents);
    } else if (options.createRoutes) {
      createRoutes(options, jsonFullContents);
    } else if (options.createCRUD) {
      createCRUD(options, jsonFullContents);
      // if (options.all) {
      //   if (options.force) {
      //     // createCRUD(options);
      //   }
      //   console.log("--create:crud --all");
      // } else {
      //   process.argv.shift(); // skip node directory
      //   process.argv.shift(); // skip directory
      //   process.argv.shift(); // skip --create:crud
      //   console.log(process.argv.join(" "));
      //   console.log("--create:crud file");
      // }
    }
  }
}

/**
 * COMMANDS
 * dricup --init (will setup dricup.config.js and dricup/schemas/users.json)
 * dricup --yes
 * dricup --git
 * dricup --create:project template="hello"
 * dricup --create:crud -all -force
 * dricup --create:crud <file_name>
 *
 */
