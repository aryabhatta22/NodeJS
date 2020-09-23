const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

/* ----------------------- HTTP functions -----------------------*/

const filterObj = (obj , ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowFields.includes(el)) 
      newObj[el] = obj[el];
  })
  return newObj;
}

exports.getAllUsers = catchAsync (async (req, res) => {
  const user = await User.find();


  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user
    }
  });
  });
  
  
  exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    });
  };
  
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user POST password data
  if(req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is not for password updates. Please, use /updateMyPasssword', 400))

   // 2. Filtered out fileds which are not allowed
  const filteredbody = filterObj(req.body, 'name', 'email');
   
  // 3. Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredbody, 
    {
      new: true,
      runValidators:true
    });
  
  

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  })
})

exports.deleteMe = catchAsync(async (req,res,next) => {
  await User.findByIdAndUpdate(req.user.id , {active: false})

  res.status(204).json({
    status: 'success',
    data: null
  })
})

  exports.getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    });
  };
  
  exports.updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    });
  };
  
  exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    });
  };
  
