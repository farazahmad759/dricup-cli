# dricup-crud-express

Create quick RESTful APIs using Express + Knex + Objection. A single command `dricup-crud-express` will generate 
- Migration files,
- Model files,
- Controller files, and
- Express Route files

You will save hours of your development.
# Getting started
You get CRUD APIs in three simple steps.
## Step 1
Install the package globally using 
```
npm install -g @farazahmad759/dricup-crud-express
```
## Step 2
Navigate to your Express project's root directory, and create *schemas* directory in `<project_root>/db` directory. It is the `<project_root>/db/schemas` directory where you will create `.json` schema files.

Your *Express* project directory structure should look like this

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
dricup-crud-express
```
and then install *npm* packages using
```
npm install
```
The `dricup-crud-express` command will generate the following files and directories.
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
ecag.config.json
```

## Step 5
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

Now start your *Express* App using `npm start`, and boom!!! your CRUD API is ready. `dricup-crud-express` provides the following *routes*

- `POST`    /users        --- to create a new user
- `GET`     /users/:id    --- to get a user by Id
- `PUT`     /users/:id    --- to update a user by Id
- `DELETE`  /users/:id    --- to delete a user by Id
- `GET`     /users        --- to get all users (filters by each database column are already created for you)
