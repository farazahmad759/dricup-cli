var usersRouter = require("./users");
var indexRouter = require("./index");
function register(app) {
  app.use("/users", usersRouter);
  app.use("/", indexRouter);
}
let exp = {
  register,
};
module.exports = exp;
