const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get Tour data from collection
  const tours = await Tour.find();
  // tours.startLocationArray = tours.map((el) => el.startLocation);
  // console.log(tours);

  // 2 ) Build template

  // 3) Render that template using tour data from step 1.

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};
