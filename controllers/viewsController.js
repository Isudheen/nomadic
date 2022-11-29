// const User = require('../models/userModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const { schema } = require('../models/tourModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get Tour data from collection
  const tours = await Tour.find();
  // 2 ) Build template

  // 3) Render that template using tour data from step 1.

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // 2) Build template
  // 3) Render template using data from 1

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Create new account',
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  const reviews = await Review.find({ user: req.user.id });

  //2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('my-bookings', {
    title: 'My Tours',
    tours,
    reviews,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });
  res.status(200).render('my-reviews', {
    title: 'My Reviews',
    reviews,
  });
});

exports.getReviewEdit = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  res.status(200).render('review-edit', {
    review,
  });
});

exports.getTourManage = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('tour-manage', {
    tours,
  });
});

exports.getTourEdit = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  res.status(200).render('tour-edit', {
    tour,
  });
});

exports.getUserManage = catchAsync(async (req, res, next) => {
  const users = await User.find().select('+active');
  // 'active' is not selected in schema, so selecting explicitly
  res.status(200).render('user-manage', {
    users,
  });
});

exports.getUserEdit = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('+active');
  res.status(200).render('user-edit', {
    user,
  });
});

exports.getReviewManage = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).render('review-manage', {
    reviews,
  });
});

exports.getBookingManage = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).render('booking-manage', {
    bookings,
  });
});

exports.getReviewCreate = catchAsync(async (req, res, next) => {
  const currentUser = res.locals.user;
  const tourId = req.params.id;
  const reviews = await Review.findOne({ user: currentUser }, { tour: tourId });
  if (reviews) {
    return res.status(400).render('error', {
      title: 'Something went wrong!',
      msg: 'Review already exists',
    });
  }
  res.status(200).render('review-create', {
    tourId,
  });
});
