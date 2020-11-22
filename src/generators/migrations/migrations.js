import fs from "fs";
export function buildContent(params) {
  let { jsonData } = params;
  //   console.log(params);
  let c_up = `exports.up = function (knex) {
    return knex.schema.createTable('${jsonData.tableName}', function (table) {
      table.increments();\n`;
  // create fields
  jsonData.fields.forEach((item) => {
    c_up += `table.${item.type}('${item.title}')`;
    c_up += item.notNullable === "true" ? `.notNullable()` : ".nullable()";
    c_up += `;\n`;
  });
  // create fields ends
  c_up += `
    });
  };`;

  let c_down = `exports.down = function (knex) {
    return knex.schema.dropTable('${jsonData.tableName}');
  };
  `;
  let c_return = c_up + c_down;
  // console.log(c_return);
  return c_return;
}

/**
 * make()
 * @description builds and creates a migration file
 */
const make = (params) => {};

let dvMigrations = {
  buildContent,
  make,
};
export default dvMigrations;
