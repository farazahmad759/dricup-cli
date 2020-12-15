
    
var tasksRouter = require('./tasks')
var usersRouter = require('./users')
var indexRouter = require('./index')
    function register(app) {
      
app.use('/tasks', tasksRouter)
app.use('/users', usersRouter)
app.use('/', indexRouter)
    }
    let exp = {
      register
    }
    module.exports = exp;
    