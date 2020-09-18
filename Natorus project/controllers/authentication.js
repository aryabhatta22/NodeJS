const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync( async(req, res, next) => {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user:newUser
        }
    });
});


exports.login = catchAsync (async (req, res, next) =>  {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({email: email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = catchAsync( async (req, res, next) => {
    let token;
    // 1. getting token and check if it exist
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) {
        return next(new AppError('You are not loggedIn. Please login to get access.', 401))
    }

    // 2. Verification token
    const decoded = await promisify (jwt.verify)(token, process.env.JWT_SECRET)     // the deocded will recieve the user id
    // console.log(decoded)

    // 3. check if user still exists
    const currentUser = await User.findById(decoded.id)
    if(!currentUser) {
        return next(new AppError('The user belonging to this token does not exist', 401))
    }

    // 4. check if user change password after token issued
    if(currentUser.changePasswordAfter(decoded.iat))  {
        return next(new AppError('Use recently changed password! Please logIn again', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.restrictTo = (... roles) => {
    return (req, res, next) => {
        // roles is an array 
        if(!roles.includes(req.user.role))
            return next(new AppError('You do not have permission to perform this action', 403))
        next();
    }
}