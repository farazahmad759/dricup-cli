exports.up = function (knex) {
    return knex.schema.createTable('tasks', function (table) {
      table.increments();
table.string('title').nullable();
table.text('description').nullable();
table.string('status').nullable();

    });
  };exports.down = function (knex) {
    return knex.schema.dropTable('tasks');
  };
  