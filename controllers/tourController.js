const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
//middleware for getting top tours

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' }); //Model, populateOptns
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour); //Not for updating passwords
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, //matches documents with ratingsAverage gte 4.5
    },
    {
      $group: {
        _id: '$difficulty', //Makes below calculations on on each group separately (easy, medium, difficult)
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //returns a new document for each entry in the array of startDates
    },
    {
      $match: {
        startDates: {
          //matches date from January first to December 31 of the requested year
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, //to group by month( 1 to 12)
        numTourStarts: { $sum: 1 }, //adds the num of documents in each id
        tours: { $push: '$name' }, //creates an array with name field of documents.
      },
    },
    {
      $addFields: { month: '$_id' }, //to add month field which is set to _id
    },
    {
      $project: { _id: 0 }, //to remove id
    },
    {
      $sort: { numTourStarts: -1 }, //to sort in descending order according to numTourStarts count
    },
    {
      $limit: 50, //limits the number of docs
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
