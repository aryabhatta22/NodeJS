const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true
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
    required: [true, 'A tour must have difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: Number,
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
  startDates: [Date]
})

// DOCUMENT MIDDLEWARE: runs before .save() & .create()

tourSchema.pre('save', function(next) {
  //console.log(this);
  this.slug = slugify(this.name, {lower: true})
  next();
})

tourSchema.pre('save', function(next) {
  console.log('Will save the document....');
  next();
})

// DOCUMENT MIDDLEWARE: runs after .save() & .create()

tourSchema.post('save', function(doc, next) {
  console.log(doc);     // this will be the document after creation
  next();
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;