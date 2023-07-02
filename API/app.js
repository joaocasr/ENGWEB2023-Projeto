var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose')
/*
mongoose.connect(process.env.MONGODB_URL, 
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000});
*/
var mongoDB = 'mongodb://127.0.0.1/MapaBraga'
mongoose.connect(mongoDB,{useNewUrlParser: true,useUnifiedTopology:true})
  
var db = mongoose.connection;
db.on('error',console.error.bind(console,"eerro"))
db.on('open',function() {
  console.log("Conexão ao MongoDB realizada com sucesso...")
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// isto é preciso para resolver o problema do GET nos comentários, basicamente o browser não deixa fazer GETs a outros servidores
const cors = require('cors');
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err)
});

module.exports = app;
