import fs from "fs";
import { getRelativePath, readEcagConfigFile } from "./../../utils/functions";
var pluralize = require("pluralize");
let dvCrudConfig = readEcagConfigFile();

export function buildContent(params) {
  let { jsonData } = params;
  let modelName = pluralize.singular(jsonData.tableName);
  modelName = capitalizeFirstLetter(modelName);
  let c_content = {};
  let modelsDirectoryPath = getRelativePath(
    dvCrudConfig.models_path,
    dvCrudConfig.controllers_path + jsonData.tableName
  );

  c_content.imports = `
  const models = require('${modelsDirectoryPath}models/index.js');
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
        links: {
          self: req.originalUrl
        },
        "meta": {
          "copyright": "Copyright 2020 ${dvCrudConfig.YOUR_COMPANY_NAME}.",
        },
        data: _res ? _res : null,
        "jsonapi": {
          "version": "${dvCrudConfig.JSON_API_VERSION}"
        }
    })
    } catch (err) {
      res.send({
        errors: [
          {
            title: "Error occurred while adding a Record in the database.",
            meta: {
              name: err.nativeError ? err.nativeError.name: null,
              nativeError: {
                code: err.nativeError ? err.nativeError.code: null,
                sqlMessage: err.nativeError ? err.nativeError.sqlMessage: null,
              }
            }
          }
        ]
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
        links: {
          self: req.originalUrl
        },
        "meta": {
          "copyright": "Copyright 2020 ${dvCrudConfig.YOUR_COMPANY_NAME}.",
        },
        data: _res ? _res : null,
        "jsonapi": {
          "version": "${dvCrudConfig.JSON_API_VERSION}"
        }
    });
    } catch(err) {
      res.send({
        errors: [
          {
            title: "Failed to get a Record with id = " + req.params.id,
            meta: {
              name: err.nativeError ? err.nativeError.name: null,
              nativeError: {
                code: err.nativeError ? err.nativeError.code: null,
                sqlMessage: err.nativeError ? err.nativeError.sqlMessage: null,
              }
            }
          }
        ]
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
      let _res = await dbModel.query().patchAndFetchById(req.params.id, _insert);
      res.send({
        data: _res ? _res : null
      });  
    } catch(err) {
      res.send({
        errors: [
          {
            title: "Failed to update the Record with id = " + req.params.id,
            meta: {
              name: err.nativeError ? err.nativeError.name: null,
              nativeError: {
                code: err.nativeError ? err.nativeError.code: null,
                sqlMessage: err.nativeError ? err.nativeError.sqlMessage: null,
              }
            }
          }
        ]
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
        data: {
          id: _res ? req.params.id : null
        }
      });  
    } catch(err) {
      res.send({
        errors: [
          {
            title: "Failed to delete the Record with id = " + req.params.id,
            meta: {
              name: err.nativeError ? err.nativeError.name: null,
              nativeError: {
                code: err.nativeError ? err.nativeError.code: null,
                sqlMessage: err.nativeError ? err.nativeError.sqlMessage: null,
              }
            }
          }
        ]
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
          links: {
            self: req.originalUrl
          },
          "meta": {
            "copyright": "Copyright 2020 ${dvCrudConfig.YOUR_COMPANY_NAME}.",
          },
          data: _res,
          "jsonapi": {
            "version": "${dvCrudConfig.JSON_API_VERSION}"
          }
        });
    } catch(err) {
      res.send({
        errors: [
          err
        ]
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
