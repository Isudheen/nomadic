const mongoose = require('mongoose');

//Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `A tour must have a name`],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, `A tour must have group size`],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, `A tour must have a difficulty`],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, `A tour must have a price`],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String], //A array of strings
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});
//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
