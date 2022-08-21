require('./api/models/db');

const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const bodyParser = require("body-parser");
const express = require('express');
const logger = require('morgan');
const path = require('path');
const formidable = require('express-formidable');

const routesApi = require('./api/routes/index');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(formidable({ multiples: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", routesApi);

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
});

module.exports = app;