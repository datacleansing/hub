var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var stylus = require('stylus');
var nib = require('nib');

var dashboard = require('./routes/dashboard');
var repo = require('./routes/repo');
var repo_svcs = require('./routes/repo_svcs');
var repo_models = require('./routes/repo_models');
var evaluator = require('./routes/evaluator');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', dashboard);
app.use('/repo', repo);
app.use('/repo/svcs', repo_svcs);
app.use('/repo/models', repo_models);
app.use('/evaluation', evaluator);

app.use(function(req, res, next) {

  //to allow cross domain requests to send cookie information.
  res.header('Access-Control-Allow-Credentials', true);

  // origin can not be '*' when crendentials are enabled. so need to set it to the request origin
  res.header('Access-Control-Allow-Origin',  req.headers.origin);

  // list of methods that are supported by the server
  res.header('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE');

  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
