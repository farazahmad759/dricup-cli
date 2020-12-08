# Dricup-cli

Create quick RESTful APIs using Express + Knex + Objection. A single command `dricup` will generate

- Migration files,
- Model files,
- Controller files, and
- Express Route files

You will save hours of your development.

## Use Cases

- Build a Todo App in less than 5 minutes
  https://farazahmad759.medium.com/build-a-todo-app-in-less-than-5-minutes-in-node-express-ada63d7c54b9

# Getting started

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
