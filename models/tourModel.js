const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

//Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `A tour must have a name`],
      unique: true,
      trim: true,
      maxlength: [40, `A tour must have less or equal than 40 characters`],
      minlength: [10, `A tour must have more or equal than 10 characters`],
    },
    duration: {
      type: Number,
      required: [true, `A tour must have group size`],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, `A tour must have a group size`],
    },
    difficulty: {
      type: String,
      required: [true, `A tour must have a difficulty`], //shorthand for
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: `Difficulty is either: 'easy', 'medium' or 'difficult'`,
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, `Rating must be above 1.0`],
      max: [5, `Rating must be below 5.0`],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, `A tour must have a price`],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this on;y points to current doc on new document creation, and not on update
          return val < this.price;
        },
        message: `Discount price ({VALUE}) should be less than price `,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, `A tour must have a description`],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, `A tour must have a cover image`],
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
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], //longitude first then latitude, unlike regular
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number], //longitude first then latitude, unlike regular
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        // referencing to user collection
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
//virtual property
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Document middleware: runs before .save() and .create()
// has access to the document before saving.
tourSchema.pre('save', function (next) {
  this.slug = slugify.default(this.name, { lower: true });
  next();
});

//guides: Embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
// });

//has access to the just saved doc
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
//'find' hook is executed to find queries. The regex /^find/ is for selecting all query functions starting with find, like find, findOne, findOneAndUpdate etc.
// this keyword will be pointing to the query object and not any documents.
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//To populate all the queries with find
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
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
