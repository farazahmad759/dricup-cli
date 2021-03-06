import chalk from "chalk";
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
  createFrontend,
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
      "--create:frontend": Boolean,
      "--create:crud": Boolean,
      "--create:migrations": Boolean,
      "--create:models": Boolean,
      "--create:controllers": Boolean,
      "--create:routes": Boolean,
      "--create:views": Boolean,
      "--all": Boolean,
      "--file": String,
      "--path": String,
      "--framework": String,
      "--framework-cli": String,
      "--static": Boolean,
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
    createFrontend: args["--create:frontend"] || false,
    all: args["--all"] || false,
    file: args["--file"] || null,
    path: args["--path"] || null,
    framework: args["--framework"] || "static",
    frameworkCli: args["--framework-cli"] || "true",
    static: args["--static"] || false,
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

  if (options.createProject) {
    createProject(options);
  } else if (options.createFrontend) {
    createFrontend(options);
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
      if (options.all) {
        createCRUD(options, jsonFullContents);
        console.log("--create:crud --all");
      } else if (options.file) {
        createCRUD(options, jsonFullContents);
        console.log("--create:crud file");
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
