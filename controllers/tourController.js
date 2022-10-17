const Tour = require('./../models/tourModel');

//middleware for getting top tours
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['fields', 'sort', 'page', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1B. Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    //replace matched expression with $ prepended to the expression, to get eg. $gte in MQL for mongo. eg.
    // { difficulty: 'easy', duration: { $gte: 5 } } because incoming query(from url - duration[gte]=5) ,will be like:
    // { difficulty: 'easy', duration: { gte: 5 } }
    // in regex \b for selecting exact words and g flag for all occurrence
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const multiSort = req.query.sort.split(',').join(' '); // If current sort query is sort=price,-ratingsAverage
      //Splits the comma separated string into an array and join into one string with space b/w words. minus sign sorts in descending order.
      this.query = this.query.sort(multiSort);
      console.log(multiSort);
    } else {
      this.query = this.query.sort('-createdAt'); //default sort. descending order of time
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const allFields = req.query.fields.split(',').join(' '); //---Inclusion projection If current query is fields=name,price ----name and price are included
      this.query = this.query.select(allFields);
      console.log(allFields);
    } else {
      this.query = this.query.select('-__v'); //default condition. minus sign means exclusion projection __v is excluded. Cannot use inclusion and exclusion projections together.
    }
    return this;
  }

  paginate() {
    // eg. page=2&limit=10...Here on page 1: 1st-10th entries, on page 2: 11th-20th entries etc...
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
    //Build query
    // 1A. Filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['fields', 'sort', 'page', 'limit'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // //1B. Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // //replace matched expression with $ prepended to the expression, to get eg. $gte in MQL for mongo. eg.
    // // { difficulty: 'easy', duration: { $gte: 5 } } because incoming query(from url - duration[gte]=5) ,will be like:
    // // { difficulty: 'easy', duration: { gte: 5 } }
    // // in regex \b for selecting exact words and g flag for all occurrence
    // let query = Tour.find(JSON.parse(queryStr));

    //2. Sorting
    // if (req.query.sort) {
    //   const multiSort = req.query.sort.split(',').join(' '); // If current sort query is sort=price,-ratingsAverage
    //   //Splits the comma separated string into an array and join into one string with space b/w words. minus sign sorts in descending order.
    //   query = query.sort(multiSort);
    //   console.log(multiSort);
    // } else {
    //   query = query.sort('-createdAt'); //default sort. descending order of time
    // }

    //3. Field limiting
    // if (req.query.fields) {
    //   const allFields = req.query.fields.split(',').join(' '); //---Inclusion projection If current query is fields=name,price ----name and price are included
    //   query = query.select(allFields);
    //   console.log(allFields);
    // } else {
    //   query = query.select('-__v'); //default condition. minus sign means exclusion projection __v is excluded. Cannot use inclusion and exclusion projections together.
    // }

    //4. Pagination
    // eg. page=2&limit=10...Here on page 1: 1st-10th entries, on page 2: 11th-20th entries etc...
    // if (req.query.page) {
    //   const page = req.query.page * 1 || 1;
    //   const limit = req.query.limit * 1 || 1;
    //   const skip = (page - 1) * limit;
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    //   query = query.skip(skip).limit(limit);
    // }

    // Execute query
    const features = new APIfeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //chaining methods works because of "return this", which returns the entire object.
    const tours = await features.query;

    //Sending response
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
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
