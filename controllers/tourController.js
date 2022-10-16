const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  //Build query
  // 1. Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['fields', 'sort', 'page', 'limit'];
  excludedFields.forEach((el) => delete queryObj[el]);

  //2. Advanced filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g); // in regex \b for selecting exact words and g flag for all occurrence

  const query = Tour.find(JSON.parse(queryString));
  console.log(query);
  //Execute query
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
