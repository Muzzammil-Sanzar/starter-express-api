require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var debug = require('debug')('eattime-backend:server');
var http = require('http');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var resturantRoutes = require('./server/routes/resturantRoutes');
var orderRoutes = require('./server/routes/orderRoutes');
var newslatterRoutes = require('./server/routes/newsLatterRoutes');
// var userRoutes = require('./server/routes/users');

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
app.use('/newslatter', newslatterRoutes);
// app.use('/user', userRoutes);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('Listening on', bind)
}

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Eattime Backend runing!!!')
})
// app.listen(process.env.PORT || 3000)