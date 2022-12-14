const cors = require('cors');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// GLOBAL MIDDLEWARES
app.use(cors());
app.options('*', cors());
// Set security HTTP headers
// app.use(helmet());

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Request limit exceeded, please try again later.',
});
app.use('/api', limiter);
//Body Parser - reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

//Data sanitization against XSS
app.use(xss());
app.use(cookieParser());

//Test middleware
app.use((req, res, next) => {
  next();
});

//Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter); //Mounting the router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//Error route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});
//In any middleware, any argument passed in to next() is treated as an error and skips all the rest of the middlewares in the middleware stack and sends the error argument to the global error handling middleware.

//Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
