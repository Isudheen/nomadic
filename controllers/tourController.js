const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  //Build query
  // 1A. Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['fields', 'sort', 'page', 'limit'];
  excludedFields.forEach((el) => delete queryObj[el]);

  //1B. Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  //replace matched expression with $ prepended to the expression, to get eg. $gte in MQL for mongo. eg.
  // { difficulty: 'easy', duration: { $gte: 5 } } because incoming query(from url - duration[gte]=5) ,will be like:
  // { difficulty: 'easy', duration: { gte: 5 } }
  // in regex \b for selecting exact words and g flag for all occurrence
  let query = Tour.find(JSON.parse(queryStr));

  //2. Sorting
  if (req.query.sort) {
    const multiSort = req.query.sort.split(',').join(' '); // If current sort query is sort=price,-ratingsAverage
    //Splits the comma separated string into an array and join into one string with space b/w words. minus sign sorts in descending order.
    query = query.sort(multiSort);
    console.log(multiSort);
  } else {
    query = query.sort('-createdAt'); //default sort. descending order of time
  }

  //3. Field limiting
  if (req.query.fields) {
    const allFields = req.query.fields.split(',').join(' '); //---Inclusion projection If current query is fields=name,price ----name and price are included
    query = query.select(allFields);
    console.log(allFields);
  } else {
    query = query.select('-__v'); //default condition. minus sign means exclusion projection __v is excluded. Cannot use inclusion and exclusion projections together.
  }
  // Execute query
  const tours = await query;

  //Sending response
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //findById(req.params.id) is shorthand for findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      result: tour.length,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //to send the updated document
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour, //since property name has same name as value tour: tour, Thanks to ES6
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
