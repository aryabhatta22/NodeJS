const Tour = require('./../models/tourModels')

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

            /* we need to split the sorting fields by "," from the URL query string
              Then we will seperate each field by space and join them as
              .../tours?sort=price,rating     --->  sort(price rating)   for mongoose query   */

    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      console.log('Sorting Fields: \n',sortBy)
      query = query.sort(sortBy)
    } else {
      // Deafult sorting field
      query = query.sort('-createdAt')
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
  