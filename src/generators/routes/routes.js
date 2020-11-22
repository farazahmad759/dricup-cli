import fs from "fs";
var pluralize = require("pluralize");

export function buildContent(params) {
  let { jsonData } = params;
  let modelName = pluralize.singular(jsonData.tableName);
  modelName = capitalizeFirstLetter(modelName);
  let c_content = {};
  c_content.imports = `
  var controller = require('./../db/controllers/${jsonData.tableName}');
  var express = require('express');
  var router = express.Router();`;

  c_content.main = `
  router.post('/', controller.createOne);
  router.get('/:id', controller.getOne);
  router.put('/:id', controller.updateOne);
  router.delete('/:id', controller.deleteOne);
  router.get('/', controller.getAll);
  
  module.exports = router;
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

let dvRoutes = {
  buildContent,
  make,
};

export default dvRoutes;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
