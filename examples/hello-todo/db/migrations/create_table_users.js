exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
      table.increments();
table.string('name').nullable();
table.string('email').nullable();

    });
  };exports.down = function (knex) {
    return knex.schema.dropTable('users');
  };
  