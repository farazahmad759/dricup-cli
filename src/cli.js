import arg from "arg";
import inquirer from "inquirer";
import { createCRUD, createProject } from "./main";
var fs = require("fs");
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "--create:project": Boolean,
      "--create:crud": Boolean,
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
    createProject: args["--create:project"] || false,
    createCRUD: args["--create:crud"] || false,
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
  let options = parseArgumentsIntoOptions(args);
  // options = await promptForMissingOptions(options);
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  // #0 copy files
  console.log("args", options);
  if (options.createProject) {
    createProject(options);
    console.log("--create:project");
  } else if (options.createCRUD) {
    createCRUD(options);
    if (options.all) {
      if (options.force) {
        // createCRUD(options);
      }
      console.log("--create:crud --all");
    } else {
      // first check if files already exist
      // createCRUD(options);
      process.argv.shift(); // skip node directory
      process.argv.shift(); // skip directory
      process.argv.shift(); // skip --create:crud
      console.log(process.argv.join(" "));
      console.log("--create:crud file");
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
