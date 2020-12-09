var tasksRouter = require("./tasks");
var usersRouter = require("./users");
var indexRouter = require("./index");
let models = {
  tasksRouter,
  usersRouter,
  indexRouter,
};
module.exports = models;
