const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  const allTours = await Tour.find();

  res.status(200).json({
    status: 'success',
    result: allTours.length,
    data: {
      tours: allTours,
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
