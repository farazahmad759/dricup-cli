import fs from "fs";
var pluralize = require("pluralize");

export function buildContent(params) {
  let { jsonData } = params;
  let modelName = pluralize.singular(jsonData.tableName);
  modelName = capitalizeFirstLetter(modelName);
  let c_content = {};
  c_content.imports = `
  const { Model } = require('objection');
  const knex = require('knex');
  const knexFile = require('../../knexfile');
  `;
  c_content.main = `
  Model.knex(knex(knexFile.knexConfig.development));
  class ${modelName} extends Model {
    static get tableName() {
      return '${jsonData.tableName}';
    }
  }
  module.exports = User;
  `;

  let _ret = ``;
  Object.keys(c_content).forEach((key) => {
    _ret += c_content[key];
    _ret += `\n`;
  });
  return _ret;
}

/**
 * make()
 * @description builds and creates a migration file
 */
const make = (params) => {};

let dvModels = {
  buildContent,
  make,
};

export default dvModels;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
