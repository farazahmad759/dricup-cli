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
      "--project:generate": Boolean,
      "--crud:generate": Boolean,
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
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
    projectGenerate: args["--project:generate"] || false,
    crudGenerate: args["--crud:generate"] || false,
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
  if (options.projectGenerate) {
    createProject(options);
    console.log("--project:generate");
  } else if (options.crudGenerate) {
    if (options.all) {
      if (options.force) {
        // createCRUD(options);
      }
      console.log("--crud:generate --all");
    } else {
      // first check if files already exist
      // createCRUD(options);
      process.argv.shift(); // skip node directory
      process.argv.shift(); // skip directory
      process.argv.shift(); // skip --crud:generate
      console.log(process.argv.join(" "));
      console.log("--crud:generate file");
    }
  }
}

/**
 * COMMANDS
 * dricup --yes
 * dricup --git
 * dricup --project:generate
 * dricup --crud:generate -all -force
 * dricup --crud:generate <file_name>
 *
 */
