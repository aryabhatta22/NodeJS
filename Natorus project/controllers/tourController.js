const Tour = require('./../models/tourModels')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAvergae,summary,difficulty';
  next();
}

/* ----------------------- HTTP functions -----------------------*/

exports.getAllTours = async (req, res) => {

  try {

    console.log('URL query: \n', req.query)
    // BUILD QUERY
        // 1) Filtering

    const queryObj = {...req.query}   // shallow copy of  query object
    const excludedFields = ['page', 'sort','limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])

        // 1) Advance Filtering

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log('After excluding: \n',JSON.parse(queryStr))

    let query = Tour.find(JSON.parse(queryStr))

            // 3) Sorting


    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      console.log('Sorting Fields: \n',sortBy)
      query = query.sort(sortBy)
    } else {
      // Deafult sorting field
      query = query.sort('-createdAt')
    }

            // 4) Limiting

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');;
      query = query.select(fields);
    } else {
      // mongoose uses __v in document but could return everything otherthan this by using '-' with __v
      query = query.select('-__v')
    }

            // 3) Pagination

    const page  = req.query.page * 1 || 1 ; 
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    
    if(req.query.page) {
      const numTours = await Tour.countDocuments();
      if(skip >= numTours) throw new Error('This page does not exist');
    }


    // EXECUTE QUERY
    const tours = await query


    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }

  
};
  
  exports.getOneTour = async (req, res) => {
    try {
      const tour = await Tour.findById(req.params.id);

      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
    } catch(err) {
      res.status(404).json({
        status: 'fail',
        message: err
      })
    }
  };
  
  
  exports.createTour = async (req,res) => {
    
    try{
      const newTour = await Tour.create(req.body);
      return res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'Fail',
        message: err
      })
    }
    
  
  }
  
  
exports.UpdateTour = async (req, res) => {
  try {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  }catch(err) {
    res.status(400).json({
      status: 'Fail',
      message: err
    })
  }
}
  
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    })
  }catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}
  