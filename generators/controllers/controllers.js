import fs from "fs";
var pluralize = require("pluralize");

export function buildContent(params) {
  let { jsonData } = params;
  let modelName = pluralize.singular(jsonData.tableName);
  modelName = capitalizeFirstLetter(modelName);
  let c_content = {};
  c_content.imports = `
  const models = require('../models/index.js');
  const dbModel = models.${modelName};
  const modelName = '${modelName}';`;

  /** =============
   *  CREATE ONE
   *  =============
   */
  c_content.createOne = `
  /**
   * @route /
   * @method POST
   * @description Create a Record in database
   * @param {json} req
   * @param {json} res
   */
  exports.createOne = async (req, res) => {
    let _insert = req.body;
    try {
      let _res = await dbModel.query().insert(_insert);
      res.send({
        message: "Record created successfully",
        data: _res
      })
    } catch (err) {
      res.send({
        error: err
      })
    }
  };`;

  /** =============
   *  GET ONE
   *  =============
   */
  c_content.getOne = `
  /**
   * @route /:id
   * @method GET
   * @description Get a Record by id
   * @param {json} req
   * @param {json} res
   */
  exports.getOne = async (req, res) => {
    try {
      let _res = await dbModel.query().findById(req.params.id);
      res.send({
        message: "Record found successfully",
        data: _res
      });
    } catch(err) {
      res.send({
        error: err
      });  
    }
  };`;

  /** =============
   *  UPDATE ONE
   *  =============
   */
  c_content.updateOne = `
  /**
   * @route /:id
   * @method PUT
   * @description Update the Record in the database by id
   * @param {json} req
   * @param {json} res
   */
  exports.updateOne = async (req, res) => {
    try {
      let _insert = req.body;
      let _res = await dbModel.query().findById(req.params.id).patch(_insert);
      res.send({
        message: "Record updated successfully",
        data: _res
      });  
    } catch(err) {
      res.send({
        error: err
      });  
    }
  };`;

  /** =============
   *  DELETE ONE
   *  =============
   */
  c_content.deleteOne = `
  /**
   * @route /:id
   * @method DELETE
   * @description Delete the record from the database by id
   * @param {json} req
   * @param {json} res
   */
  exports.deleteOne = async (req, res) => {
    try {
      let _res = await dbModel.query().deleteById(req.params.id);
      res.send({
        message: "Record deleted successfully",
        data: _res
      });  
    } catch(err) {
      res.send({
        error: err
      });  
    }
  };
  `;

  /** =============
   *  GET ALL
   *  =============
   */
  c_content.index = `
  /**
   * @route /
   * @method GET
   * @description Get all the records
   * @param {json} req
   * @param {json} res
   */
  exports.getAll = async (req, res) => {

    // base variables
    let filterQuery = {};
    let filterIncludes = [];
    let filterOrder = [['id', 'ASC']];

    // construct query
    try {
      let _res = dbModel.query();`;
  jsonData.fields.forEach((fld) => {
    c_content.index += `
        if(req.query.${fld.title}) {
          _res = _res.where('${fld.title}', 'like', '%' + req.query.${fld.title} + '%')
        }
        `;
  });
  c_content.index += `
        _res = await _res;
      
        // return response
        res.send({
          message: "Your searched fetched the following results",
          data: _res
        })    
    } catch(err) {
      res.send({
        errorMessage: "Error occurred",
        error: err
      }) 
    }
  };`;

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

let dvControllers = {
  buildContent,
  make,
};

export default dvControllers;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
