const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// const { resolveSoa } = require('dns');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//Middlewares

const dateMiddleware = (req, res, next) => {
  req.requestTime = new Date().toDateString();
  next();
};

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); //to access req.body
app.use(express.static(`${__dirname}/public`));
app.use(dateMiddleware);

//Routes
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
