const express = require('express');
const app = express();
const morgan = require('morgan');
// const { resolveSoa } = require('dns');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//Middlewares
const myMiddleware1 = (req, res, next) => {
  console.log('Hello from the middleware1');
  next();
};
const dateMiddleware = (req, res, next) => {
  req.requestTime = new Date().toDateString();
  next();
};

app.use(morgan('dev'));
app.use(express.json()); //to access req.body
app.use(myMiddleware1);
app.use(dateMiddleware);

//Routes
app.use('/api/v1/tours', tourRouter); //Mounting the router
app.use('/api/v1/users', userRouter);

module.exports = app;
