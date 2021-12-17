const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const moviesRouter = require('./routes/movies'); //movies router dahil edildi.
const directorsRouter = require('./routes/directors'); //directors router dahil edildi.

const req = require('express/lib/request');

const app = express();

// db connections 
// db.js dosyasında fonksiyonu dışarı export ettiğimiz için () kullandık.
const db = require('./helper/db')();

// Config
const config = require('./config');
app.set('api_secret_key', config.api_secret_key); // api_secret_key i global olarak kullanmak için

// Middleware
const verifyToken = require('./middleware/verify-token');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', verifyToken);
app.use('/api/movies', moviesRouter); // movies router kullanıldı.
app.use('/api/directors', directorsRouter) // directors router kullanıldı.
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
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
