const Tour = require('../models/tourModels')
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAvergae,summary,difficulty';
  next();
}


/* ----------------------- HTTP functions -----------------------*/

exports.getAllTours = async (req, res) => {

  try {

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
  