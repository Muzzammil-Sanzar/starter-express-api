require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var resturantRoutes = require('./server/routes/resturantRoutes');
var orderRoutes = require('./server/routes/orderRoutes');

// Database connection
const connectDB = require('./server/config/db');

var app = express();
connectDB();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/resturant', resturantRoutes);
app.use('/order', orderRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Eattime Backend runing!!!')
})
app.listen(process.env.PORT || 3000)