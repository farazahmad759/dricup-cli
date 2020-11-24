exports.up = function (knex) {
    return knex.schema.createTable('todos', function (table) {
      table.increments();
table.string('title').nullable();
table.string('type').nullable();
table.string('status').nullable();

    });
  };exports.down = function (knex) {
    return knex.schema.dropTable('todos');
  };
  