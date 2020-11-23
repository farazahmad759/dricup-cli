const Knex = require("knex");

var knexConfig = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      database: "express-test-app",
      user: "root",
      password: "password",
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds/development",
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
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds/staging",
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
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds/production",
    },
  },
};
var knex = Knex(knexConfig.development);

exports.knex = knex;
exports.knexConfig = knexConfig;
exports.default = knexConfig;
