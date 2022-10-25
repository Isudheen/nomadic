const path = require('path');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); //to access req.body

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
