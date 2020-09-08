const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

/* Use mongoose.connect(process.env.DATABASE_LOCAL, {......})  to conenct with local databse*/

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(con => {
  //console.log(con.connections);
  console.log('DB connection successful');
})

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;