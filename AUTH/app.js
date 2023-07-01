var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, 
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000});

//var mongoDB = 'mongodb://127.0.0.1/MapaBraga'
//mongoose.connect(mongoDB,{useNewUrlParser: true,useUnifiedTopology:true})
  

var db = mongoose.connection;
db.on('error',console.error.bind(console,"eerro"))
db.on('open',function() {
  console.log("Conexão ao MongoDB realizada com sucesso...")
})
// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'EngWeb2023', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);


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
  console.log (err); //
  res.render('error');
});

module.exports = app;