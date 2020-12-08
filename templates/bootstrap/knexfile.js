const Knex = require("knex");

var knexConfig = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      database: "dricup_test",
      user: "root",
      password: "",
    },
    migrations: {
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds/development",
    },
  },
  staging: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    migrations: {
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds/staging",
    },
  },

  production: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    migrations: {
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds/production",
    },
  },
};
var knex = Knex(knexConfig.development);

exports.knex = knex;
exports.knexConfig = knexConfig;
exports.default = knexConfig;
