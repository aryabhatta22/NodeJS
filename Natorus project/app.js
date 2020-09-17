const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError')
const globalErrorHandler =  require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();



/* ----------------------- Middlewares -----------------------*/
console.log(`In ${process.env.NODE_ENV} mode`);
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next)=> {
  req.reuestTime = new Date().toISOString();
  // console.log(req.headers)
  next(); // madatory
})

/* ----------------------- HTTP routes -----------------------*/

// Routers
app.use('/api/v1/tours', tourRouter); // midlleware
app.use('/api/v1/users', userRouter);

// Unhandled Routes
app.all('*', (req,res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`,
                      404));
})


app.use(globalErrorHandler)

module.exports = app;