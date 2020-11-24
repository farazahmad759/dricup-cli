
  const { Model } = require('objection');
  const knex = require('knex');
  const knexFile = require('../../knexfile');
  

  Model.knex(knex(knexFile.knexConfig.development));
  class Todo extends Model {
    static get tableName() {
      return 'todos';
    }
  }
  module.exports = Todo;
  
