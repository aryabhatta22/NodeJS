const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp')

const AppError = require('./utils/appError')
const globalErrorHandler =  require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();



/* ----------------------- Gloabl Middlewares -----------------------*/
// Security HTTP headers
app.use(helmet());

// Developmetn logging
console.log(`In ${process.env.NODE_ENV} mode`);
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// Limit requests from same API
const limiter = rateLimit({
  // 100 req in an hour
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many request from this IP, please try again in an hour'
});

app.use('/api',limiter);

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));


// Data sanitiazation against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration','ratingsAverage','maxGroupSize',
    'ratingsQuantity', 'difficulty', 'price'
  ]
}));

// serving static files
app.use(express.static(`${__dirname}/public`))

// Test middleware
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