var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
var indexRouter = require('./routes/index.route');
var usersRouter = require('./routes/users.route');
var authRouter = require('./routes/auth.route')
var petRouter = require('./routes/pets.route')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
var app = express();
const passportManager = require('./config/passport')
    //set up mongoDB
mongoose.connect(
    "mongodb+srv://JacobAdmin:YMicGllONeFnsAl3@cluster0-jnc1j.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }
);
var db = mongoose.connection;
db.on("error", err => console.log(err));
db.on("open", () => console.log("Connection to MongoDB"));


//Setup Bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Route setup 
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter)
app.use('/api/pet', petRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send("The requested page was not found")
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err.status);
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(passportManager.initialize());

module.exports = app;