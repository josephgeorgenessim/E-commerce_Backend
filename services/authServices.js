const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



// generate token
const generateToken = (userID) => {
    return jwt.sign({ userId: userID }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME })
}


// @desc    Sign Up
// @route   POST /api/v1/auth/signup
// @access  public
exports.signUp = asyncHandler(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    const token = generateToken(user._id)

    res.status(201).json({
        user: user,
        token: token,
        message: 'User created successfully'
    })
})


// @desc    Login
// @route   POST /api/v1/auth/login
// @access  public
exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Invalid email or password', 401))
    }

    const token = generateToken(user._id)

    res.status(201).json({
        user: user,
        token: token,
        message: 'User logged in successfully'
    })
})


exports.protect = asyncHandler(async (req, res, next) => {

    // get token and check if it's exist 
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // remove Bearer from token
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return next(new ApiError('You are not authorized to access this route', 401))
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // get user from token 
    const user = await User.findById(decoded.userId)

    if (!user) {
        return next(new ApiError('User not found', 404))
    }

    if (user.active === false) {
        return next(new ApiError('User is not active ', 401))
    }

    // check if user changed password after the token was issued 
    if (user.passwordChangedAt) {
        const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10)

        // password changed after the token was issued
        if (changedTimestamp > decoded.iat) {
            return next(new ApiError('User changed password after the token was issued , please login again.. ', 401))
        }
    }

    // pass user to next middleware
    req.user = user
    next()

})