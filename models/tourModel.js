const mongoose = require('mongoose');

//Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `name must be a string`],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, `price must be a number`],
  },
});
//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
