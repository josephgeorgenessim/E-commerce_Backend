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