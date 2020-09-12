const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40,'A tour name must have less or equal 40 chars.'],
    minlength: [5, 'A tour name must have atleast 5 chars.'],
    //validate: [validator.isAlpha, 'Tour name must only contain characters.']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must add a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is not from selected list.'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating msut be atleast 1'],
    max: [5, 'Rating msut be atmost 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate:{ 
      validator: function(val) {
        // this only points to current on new Document creation
      return val < this.price;
    },
    message: 'Discount price should be below regular price'
  }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
})

// DOCUMENT MIDDLEWARE: runs before .save() & .create()

tourSchema.pre('save', function(next) {
  //console.log(this);
  this.slug = slugify(this.name, {lower: true})
  next();
})

// tourSchema.pre('save', function(next) {
//   console.log('Will save the document....');
//   next();
// })


// tourSchema.post('save', function(doc, next) {
//   console.log(doc);     // this will be the document after creation
//   next();
// })

// QUERY MIDDLEWARE: runs before or after a query

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: {$ne: true}});
  this.start = Date.now();
  next();
})

tourSchema.post(/^find/, function(doc, next) {
    console.log(`Query took ${Date.now() - this.start} millisec.`)
    next();
  })
  
// Aggregation MIDDLEWARE: runs before or after an aggregation pipeline

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: {secretTour: {$ne: true}}})
  // console.log(this.pipeline());
  next();
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;