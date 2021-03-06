const Tour = require('../models/tourModels')
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAvergae,summary,difficulty';
  next();
}


/* ----------------------- HTTP functions -----------------------*/

exports.getAllTours = catchAsync(async (req, res,next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
  const tours = await features.query;


  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});
  
exports.getOneTour = catchAsync( async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  // if no tour exists
  if(!tour) {
    return next(new AppError('No tour Found with that ID', 404))
  }

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
});
  
  
exports.createTour = catchAsync( async (req,res, next) => {
  
  const newTour = await Tour.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });

})
  
  
exports.UpdateTour = catchAsync( async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // if no tour exists
  if(!tour) {
    return next(new AppError('No tour Found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
})
  
exports.deleteTour = catchAsync( async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  // if no tour exists
  if(!tour) {
    return next(new AppError('No tour Found with that ID', 404))
  }
  
    res.status(204).json({
      status: 'success',
      data: null
    })
})
  
exports.getTourStats = catchAsync( async (req, res, next) => {
   // An aggregate pipeline has multiple stages and each stage is an object

   const stats = await Tour.aggregate([
    {
      $match: {ratingsAverage: {$gte: 4.5}}
    },
    {
      $group: {
        _id: '$difficulty',
        // _id: null for aggregating whole document without any group
        numTours: { $sum: 1},
        numRatings: {$sum: '$ratingsQuantity'},
        avgRating: { $avg: '$ratingsAverage'},
        avgPrice: { $avg: '$price'},
        minPrice: {$min: '$price'},
        maxPrice: {$max: '$price'}
      }
    },
    {
      $sort: { avgPrice: 1}   /* 1 for ascending*/
      }
    // We can chain the methods repeatedly
    // {
    //   $match: { _id: {$ne: 'easy'}}
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {stats}
  })
})

exports.getMonthlyPlan = catchAsync (async (req,res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    { 
      $group: {
        _id: { $month: '$startDates'},
        numToursStarts: { $sum: 1 },
        tours: {$push: '$name'}
      }
    },
    {
      $addFields: { month: '$_id'}
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numToursStarts: -1}
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {plan}
  })
})