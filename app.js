require('dotenv').config();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const getRealIp = require('express-real-ip')();

const index = require('./routes');
const api = require('./routes/api');

// browserSync setup
if ( process.env.NODE_ENV != 'production' ) {
  const browserSync = require('browser-sync');
  browserSync({
    files: ['./**/*'],
    online: false,
    port: 9000,
    proxy: 'localhost:3000',
    ui: false
  });
}

const app = express();

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// session configuration
app.use(cookieSession({
  secret: process.env.SESSION_SECRET
}));

// passport configuration
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
