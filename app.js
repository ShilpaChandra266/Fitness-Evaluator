var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var moment = require('moment');
var cookieParser = require('cookie-parser');
var index = require('./routes/index');
var profile = require('./routes/profile');
var fitbit = require('./routes/fitbit');
var sleep = require('./routes/sleep');
var calories = require('./routes/calories');
var activities = require('./routes/activities');
var email = require('./routes/email');
var food = require('./routes/food');
var heart = require('./routes/heart');
var mobileApi = require('./routes/mobileApi');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Creating a redis storage for sessions
var redis   = require("redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var client  = redis.createClient();
app.use(cookieParser());
app.use(session({
    secret: 'abc234jdfsj823892j23',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
    saveUninitialized: false,
    cookie:{
        maxAge: 10 * 60 * 1000
    },
    rolling: true,
    resave: false
}));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname)));

app.use('/', index);
app.use(profile);
app.use(fitbit);
app.use(sleep);
app.use(calories);
app.use(activities);
app.use(food);
app.use(email);
app.use(heart);
app.use(mobileApi);
// app.use('/users', users);
// app.use('/authorize', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
    console.log("The error is: "+ err.message);
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3000);
console.log("Server started on 3000");

module.exports = app;


