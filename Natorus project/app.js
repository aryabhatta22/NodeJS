const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();



/* ----------------------- Middlewares -----------------------*/

app.use(morgan('dev'));

// Middleware 1
app.use(express.json());

// Middleware 2
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next(); // madatory
})

// Middleware 3
app.use((req, res, next)=> {
  /* A middle ware to keep track at what time request occurs */
  req.reuestTime = new Date().toISOString();
  next(); // madatory
})

/* ----------------------- HTTP routes -----------------------*/

// Routers
app.use('/api/v1/tours', tourRouter); // midlleware
app.use('/api/v1/users', userRouter);

module.exports = app;