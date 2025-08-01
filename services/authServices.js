const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')



// @desc    Sign Up
// @route   POST /api/v1/auth/signup
// @access  public
exports.signUp = asyncHandler(async (req , res , next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE_TIME})

    res.status(201).json({
        user:user,
        token:token,
        message:'User created successfully'
    })
})