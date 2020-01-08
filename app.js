const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {Pool} = require('pg');
const Qovery = require('qovery-client/src/Qovery');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Qovery
const qovery = new Qovery('.qovery/local_configuration.json');
const dbConf = qovery.getDatabases()[0];

// PostgreSQL
const pool = new Pool({
    user: dbConf.username,
    host: dbConf.host,
    database: 'postgres',
    password: dbConf.password,
    port: dbConf.port,
});

app.get('/', function (req, res, next) {
    pool
    res.render('index', {title: 'Express'});
});

app.get('/users', function (req, res, next) {
    res.send('respond with a resource');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
