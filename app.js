const cors = require('cors');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());
// GLOBAL MIDDLEWARES
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Request limit exceeded, please try again later.',
});
app.use('/api', limiter);

app.use(express.json()); //to access req.body - body parser
app.use(cookieParser());

//Test middleware
app.use((req, res, next) => {
  console.log(req.cookies);
  console.log('Cookie middleware');
  next();
});

//Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter); //Mounting the router
app.use('/api/v1/users', userRouter);

//Error route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});
//In any middleware, any argument passed in to next() is treated as an error and skips all the rest of the middlewares in the middleware stack and sends the error argument to the global error handling middleware.

//Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
