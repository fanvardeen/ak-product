var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var cookieSession = require('cookie-session')
//var NodeSession = require('node-session');
var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();



// view engine setup
var exphbs = require('express-handlebars');
app.engine('hbs', exphbs({defaultLayout: 'default',extname: '.hbs'})); 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:'ssshhh'}));


//app.use(session({resave: true, saveUninitialized: true, secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 60000 }}));
/*app.use(cookieSession({
  name: 'session',
  keys: ['Key1'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))*/
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api', api);

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
