const mongoose = require('mongoose');
const slugify = require('slugify');

//Schema
const tourSchema = new mongoose.Schema(
  {
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
    slug: String,
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
      select: false,
    }, //createdAt will not be send to client in response.
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//virtual property
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document middleware: runs before .save() and .create()
// has access to the document before saving.
tourSchema.pre('save', function (next) {
  this.slug = slugify.default(this.name, { lower: true });
  next();
});

//has access to the just saved doc
tourSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});

//QUERY MIDDLEWARE
//'find' hook is executed to find queries. The regex /^find/ is for selecting all query functions starting with find, like find, findOne, findOneAndUpdate etc.
// this keyword will be pointing to the query object and not any documents.
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//Post query middleware will have access to all documents returned from the query
tourSchema.post(/^find/, function (docs, next) {
  console.log(
    `Time taken for query is ${Date.now() - this.start} milliseconds`
  );
  next();
});

//Aggregation Middleware
// this keyword will be pointing to the aggregation object and not any documents.
//below function adds a match operator to the beginning of pipeline array.
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
