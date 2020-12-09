
  const { Model } = require('objection');
  const knex = require('knex');
  const knexFile = require('../knexfile');
  

  Model.knex(knex(knexFile.knexConfig.development));
  class Task extends Model {
    static get tableName() {
      return 'tasks';
    }
  }
  module.exports = Task;
  
