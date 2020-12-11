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
- [Supported Commands](#Supported-commands)
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

Open [localhost:3000](http://localhost:3000) and see your MERN app up and running :) This page comes to you via Server Side Rendering. Now, if you type [localhost:3000/app-1](http://localhost:3000/app-1), you will see another web page coming to you via Client Side Rendering.

**Database configuration**<br>
Uptill now we have only viewed static web pages that do not show any content coming from the database. In order to involve database, you need to provide credentials for your database. Don't worry, it's very easy. Just follow along.

1. Open `knexfile.js` in the root of your project. You will see a `knexConfig` object in it that has several database configurations for different environments (development, staging, production). For testing on local machine, we need to update _development_ credentials. The default credentials are

```
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      database: "express-test-app",
      user: "root",
      password: "",
    },
    migrations: {
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds/development",
    }
  }
```

Just update `host`, `database`, `user` and `password` fields in the above object.

2. Run the following command

```
knex migrate:up
```

3. Congratulations! Now you have access to _users_ Api and you can call the following endpoints

| HTTP Method | URL                             | Function                                                                                                                                                                                            |
| ----------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST        | http://localhost:3000/users     | Create new user in database                                                                                                                                                                         |
| GET         | http://localhost:3000/users/:id | Find a user by Id                                                                                                                                                                                   |
| PUT         | http://localhost:3000/users/:id | Update a user by Id                                                                                                                                                                                 |
| DELETE      | http://localhost:3000/users/:id | Delete a user by Id                                                                                                                                                                                 |
| GET         | http://localhost:3000/users     | Finds all users <br> Users can be filtered by providing the query paramaters in the URL. Like, http://localhost:3000/users?email=faraz will fetch all users whose email contains the string 'faraz' |

## Supported-commands

Dricup CLI provides several helpful commands for creating database migrations, Models, Controllers, and Routes, which are listed below. Detailed in-depth description is provided in [documentation](./documentation/documentation.md)

| Action             | Command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create Project     | `dricup --create:project` <br> Creates a new project in the current working directory (CWD)                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Create Migrations  | **Single**<br>`dricup --create:migrations --file="file_name.json"` <br> Reads `file_name.json` from _dricup/schemas_ directory and creates a database migration file in _migrations_ directory. <br><br> **Bulk**<br>`dricup --create:migrations --all` <br> Reads all `.json` files from _dricup/schemas_ directory and creates database migration files for all of them in _migrations_ directory                                                                                                                                           |
| Create Models      | **Single**<br>`dricup --create:models --file="file_name.json"` <br> Reads `file_name.json` from _dricup/schemas_ directory and creates a _Model_ file in _models_ directory.<br><br> **Bulk**<br>`dricup --create:models --all` <br> Reads all `.json` files from _dricup/schemas_ directory and creates database Models for all of them in _models_ directory.                                                                                                                                                                               |
| Create Controllers | **Single**<br>`dricup --create:controllers --file="file_name.json"` <br> Reads `file_name.json` from _dricup/schemas_ directory and creates a _Controller_ file in _controllers_ directory.<br><br> **Bulk**<br>`dricup --create:controllers --all` <br> Reads all `.json` files from _dricup/schemas_ directory and creates _Controllers_ for all of them in _controllers_ directory.                                                                                                                                                        |
| Create Routes      | **Single**<br>`dricup --create:routes --file="file_name.json"` <br> Reads `file_name.json` from _dricup/schemas_ directory and creates a _Route_ file in _routes_ directory.<br><br> **Bulk**<br>`dricup --create:routes --all` <br> Reads all `.json` files from _dricup/schemas_ directory and creates _Routes_ for all of them in _routes_ directory. <hr> Note: The routes commands above will also create/update an additional file `routes.js` in _routes_ directory.                                                                   |
| Create CRUD APIs   | **Single**<br>`dricup --create:crud --file="file_name.json"` <br> Reads `file_name.json` from _dricup/schemas_ directory and creates Migration, Model, Controller and Route files in respective directories.<br><br> **Bulk**<br>`dricup --create:crud --all` <br> Reads all `.json` files from _dricup/schemas_ directory and creates Migrations, Models, Controllers and Routes for all of them in respective directories. <hr> Note: The `crud` commands above will also create/update an additional file `routes.js` in routes directory. |

## Documentation

You can view in-depth documentation [here](./documentation/documentation.md), but let's get an overview here.
When you first run `dricup --create:project` command, it will create the following file structure.

    .
    ├── client                  # CSR rendered apps will be stored here
    │   └── app-1
    │   │   └── build
    │   │       └── index.html  # it will be rendered at localhost:3000/app-1
    │   └── `client.js`         # IMPORTANT: contains names and routes of all the client apps
    ├── controllers             # API files should be placed in this directory
    ├── dricup                  # all schemas files should be placed in dricup/schemas directory
    │   └── schemas
    │       └── users.json
    ├── migrations              # database migration files are stored here
    ├── models                  # Models in MVC are created in this directory
    ├── public                  # images, stylesheets and javascript files can be placed here
    ├── routes                  # contains application routes
    │   └── index.js
    │   └── `routes.js`         # IMPORTANT: stores information about all other files in the directory
    │   └── users.js
    ├── views                   # Views (in MVC) are stored here
    ├── app.js
    ├── dricup.config.json      # IMPORTANT: do not delete/modify it
    ├── index.js                # IMPORTANT: entry file of the app
    ├── knexfile.js             # IMPORTANT: database configurations are stored here
    ├── now.json                # IMPORTANT: config file for deployment to Vercel
    └── README.md

## Notes

### Client Apps

- Client-side rendered apps should be stored "directly" inside /client directory.
- Each app should have a "build" directory containing an index.html at the minimum. Otherwise it won't work. This applies to HTML as well as Js-framework'ed apps. If your CSR rendered app is React/Vue/Angular app, the `npm build` command should output an `index.html` file in "build" directory.
- Each app should be registered in client/client.js file, otherwise it won't be displayed. The route where this app will be displayed, is also configured in client/client.js file.

### CRUD Api

Whether you want Migrations, Models, Controllers or Routes (or even full API creation), all you have to do is provide a `some_schema.json` file for every database table. The Schema files should be of the following format.

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

## Acknowledgements

## Authors

## Support

## License

## Use-cases

- Build a Todo App in less than 5 minutes
  https://farazahmad759.medium.com/build-a-todo-app-in-less-than-5-minutes-in-node-express-ada63d7c54b9

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
