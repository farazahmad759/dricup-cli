<header>

<h1 style="font-weight:200; font-size:80px">Dricup CLI</h1>

</header>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![node-current (scoped with tag)](https://img.shields.io/node/v/@dricup/dricup-cli/latest?color=green)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
[![GitHub Issues](https://img.shields.io/github/issues/farazahmad759/dricup-cli)](https://github.com/farazahmad759/dricup-cli/issues)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A simple straightforward package to bootstrap your MERN and MEVN stack projects. The projects generated through `dricup-cli` are pre-configured for deployment to [vercel](https://vercel.com/).

## Table of Contents

- [Installation](#Installation)
- [Features](#Features)
- [Quickstart](#Quickstart)
- [Documentation](./documentation/features.md)
- [Acknowledgements](#Acknowledgements)
- [Authors](#Authors)
- [Support](#Support)
- [Use cases](#Use-cases)
- [License](#License)

## Installation

```
npm install -g @dricup/dricup-cli
```

## Features

- Bootstraps your MERN/MEVN stack projects.
- From `your_schema_file.json`, you can instantly create CRUD API's with a single command by generating the following
  - Database _Migrations_
  - _Models_
  - _Controllers_
  - _Routes_
- Supports `handlebars` templating engine for server-side-rendering (SSR)
- Supports the generation of client-side-rendered (CSR) apps
- Your projects are pre-configured for instant deployment to [Vercel](https://vercel.com/).
- Clean directory structure, taken from [express-generator](https://github.com/expressjs/generator)
-

## Quickstart

First of all open the _terminal_ if you are using MacOS or Linux, or _command_prompt_ for windows. Then run `npm install -g @dricup-dricup-cli` to install _dricup-cli_ globally.

Create and navigate to a new directory for your project

```
mkdir dricup_project && cd dricup_project
```

Create the project

```
dricup --create:project
```

Install the packages

```
npm install
```

Run the project

```
npm run server
```

Open [localhost:3000](http://localhost:3000)

## Supported-commands

Dricup CLI provides several helpful commands for creating database migrations, Models, Controllers, and Routes, which are listed below. Detailed in-depth description is provided in [documentation](./documentation/documentation.md)

| Category           | Command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create Project     | `dricup --create:project` <br> Creates a new project in the current working directory (CWD)                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Create Migrations  | **Single**<br>`dricup --create:migrations --file="file_name.json"` <br> Reads `file_name.json` from _dricup/schemas_ directory and creates a database migration file in _migrations_ directory. <br><br> **Bulk**<br>`dricup --create:migrations --all` <br> Reads all `.json` files from _dricup/schemas_ directory and creates database migration files for all of them in _migrations_ directory                                                                                                                                           |
| Create Models      | **Single**<br>`dricup --create:models --file="file_name.json"` <br> Reads `file_name.json` from _dricup/schemas_ directory and creates a _Model_ file in _models_ directory.<br><br> **Bulk**<br>`dricup --create:models --all` <br> Reads all `.json` files from _dricup/schemas_ directory and creates database Models for all of them in _models_ directory.                                                                                                                                                                               |
| Create Controllers | **Single**<br>`dricup --create:controllers --file="file_name.json"` <br> Reads `file_name.json` from _dricup/schemas_ directory and creates a _Controller_ file in _controllers_ directory.<br><br> **Bulk**<br>`dricup --create:controllers --all` <br> Reads all `.json` files from _dricup/schemas_ directory and creates _Controllers_ for all of them in _controllers_ directory.                                                                                                                                                        |
| Create Routes      | **Single**<br>`dricup --create:routes --file="file_name.json"` <br> Reads `file_name.json` from _dricup/schemas_ directory and creates a _Route_ file in _routes_ directory.<br><br> **Bulk**<br>`dricup --create:routes --all` <br> Reads all `.json` files from _dricup/schemas_ directory and creates _Routes_ for all of them in _routes_ directory. <hr> Note: The routes commands above will also create/update an additional file `routes.js` in _routes_ directory.                                                                   |
| Create CRUD APIs   | **Single**<br>`dricup --create:crud --file="file_name.json"` <br> Reads `file_name.json` from _dricup/schemas_ directory and creates Migration, Model, Controller and Route files in respective directories.<br><br> **Bulk**<br>`dricup --create:crud --all` <br> Reads all `.json` files from _dricup/schemas_ directory and creates Migrations, Models, Controllers and Routes for all of them in respective directories. <hr> Note: The `crud` commands above will also create/update an additional file `routes.js` in routes directory. |

## Acknowledgements

## Authors

## Support

## License

Create quick RESTful APIs using Express + Knex + Objection. A single command `dricup` will generate

- Migration files,
- Model files,
- Controller files, and
- Express Route files

You will save hours of your development.

## Use-cases

- Build a Todo App in less than 5 minutes
  https://farazahmad759.medium.com/build-a-todo-app-in-less-than-5-minutes-in-node-express-ada63d7c54b9

# Getting-started

You get CRUD APIs in six simple steps.

## Step 1

Install the package globally using

```
npm install -g @dricup/dricup-cli
```

## Step 2

Navigate to your Express project's root directory, and create _schemas_ directory in `<project_root>/db` directory. It is the `<project_root>/db/schemas` directory where you will create `.json` schema files.

Your _Express_ project directory structure should look like this

```
.
├── app.js
├── bin
│   └── www
└── db
    └── schemas
        ├── table_1_schema.json
        ├── table_2_schema.json
        └── table_3_schema.json
```

## Step 3

Create schema file(s). A sample schema file for `users` SQL table is included below. Feel free to copy its content and modify as per your needs.

```
{
    "tableName": "users",
    "fields": [
        {
            "title": "name",
            "type": "string"
        },
        {
            "title": "username",
            "type": "string"
        },
        {
            "title": "email",
            "type": "string"
        },
        {
            "title": "password",
            "type": "string"
        }
    ]
}
```

## Step 4

Run the following command

```
dricup
```

and then install _npm_ packages using

```
npm install
```

The `dricup` command will generate the following files and directories.

```
db
--- migrations
------ create_table_users.js
--- models
------ users.js
--- controllers
------ users.js
routes
--- users.js
knexfile.js
dricup.config.json
```

## Step 5

Open knexfile.js and adjust your database credentials. A sample configuration will be like this

```
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
```

## Step 6

In your `app.js` file, add the following two lines

```
/** ================
 *  your app.js file
 *  ================
 */


// some code

var usersRouter = require('./routes/users');
app.use('/users', usersRouter);

// even deliciuos code
```

Now start your _Express_ App using `npm start`, and boom!!! your CRUD API is ready. `dricup` provides the following _routes_

- `POST` /users --- to create a new user
- `GET` /users/:id --- to get a user by Id
- `PUT` /users/:id --- to update a user by Id
- `DELETE` /users/:id --- to delete a user by Id
- `GET` /users --- to get all users (filters by each database column are already created for you)

# Capabilities

- I have described the capabilities of the `dricup` in
  [Build a Todo App in less than 5 minutes](https://farazahmad759.medium.com/build-a-todo-app-in-less-than-5-minutes-in-node-express-ada63d7c54b9)

- There is much more you can do with it. Visit the `db/` directory in your project root and explore the directories inside it, most notably the `db/controllers` directory.
- Take a look at the `todos` controller file created by the package [here](https://github.com/farazahmad759/dricup-cli/blob/main/examples/hello-todo/db/controllers/todos.js). The controller file has five methods in it for CRUD operations.

  - createOne
  - getOne
  - updateOne
  - deleteOne
  - getAll

Feel free to modify any of the above methods according to your needs. You can even add more methods to your controllers if you want. `dricup-cli` provides you the boilerplate code for writing API's and thus saves so much of your precious time.

- `dricup.config.json` file in the root of your project defines the paths where the files will be generated, which you can modify it as you want.

# What is more?

This is just the starting. Several options will be added very soon to configure libraries such as [Sequelize](https://sequelize.org/).

Feel free to request features, and I will be delighted to assist you in the issues you experience while using this package.
