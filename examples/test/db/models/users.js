
  const { Model } = require('objection');
  const knex = require('knex');
  const knexFile = require('../../knexfile');
  

  Model.knex(knex(knexFile.knexConfig.development));
  class User extends Model {
    static get tableName() {
      return 'users';
    }
  }
  module.exports = User;
  
