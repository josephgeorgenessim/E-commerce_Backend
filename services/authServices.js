const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')

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


// @desc    Protect routes and check if user is authenticated
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


// @desc    Check if user has the required role 
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {

    // check if user has the required role
    if (!roles.includes(req.user.role)) {
        return next(new ApiError('Your are not allowed to access this route ', 403))
    }

    next();


})


// @desc    forget password 
// @route   POST /api/v1/auth/forgetPassword
// @access  public
exports.forgetPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ApiError('Email not found', 404))
    }

    // generate random code 
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // hash code 
    const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex')


    // set reset code into db
    user.passwordResetCode = hashedCode;
    user.passwordResetCodeExpiresIn = Date.now() + 10 * 60 * 1000;
    user.passwordResetCodeVerified = false;

    await user.save();
    console.log(resetCode)
    // send email 
    // try {
    //     await sendEmail({
    //         email: user.email,
    //         subject: 'Reset Password Code',
    //         message: `Hi ${user.name} \n\n Your password reset code is ${resetCode} \n\n\ 
    //         if you didn't request this code, please ignore this email`
    //     })
    // } catch (error) {
    //     user.passwordResetCode = undefined;
    //     user.passwordResetCodeExpiresIn = undefined;
    //     user.passwordResetCodeVerified = undefined;

    //     await user.save();
    //     return next(new ApiError('Failed to send email.', 500))
    // }

    //  send response
    res.status(200).json({
        message: 'Reset Code Sent To Your Email.'
    })


})


// @desc    verify reset code 
// @route   POST /api/v1/auth/verifyResetCode
// @access  public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {

    // get code from body
    const code = req.body.resetCode;

    if (!code) {
        return next(new ApiError('Reset code is required', 400))
    }

    // hash code 
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex')

    // get user from db
    const user = await User.findOne({
        passwordResetCode: hashedCode,
        passwordResetCodeExpiresIn: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ApiError('Invalid or expired code', 400))
    }

    // reset code verified'
    user.passwordResetCodeVerified = true;
    await user.save();

    res.status(200).json({
        message: 'Reset code verified successfully',
    })

})


// @desc    reset password 
// @route   POST /api/v1/auth/resetPassword
// @access  public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    // get user from db
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ApiError('User not found', 400))
    }

    // check if code is verified 
    if (user.passwordResetCodeVerified === false) {
        return next(new ApiError('Reset code is not verified ', 400))
    }

    // set new password 
    user.password = req.body.newPassword
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpiresIn = undefined;
    user.passwordResetCodeVerified = undefined;

    await user.save();

    // generate token
    const token = generateToken(user._id)


    res.status(200).json({
        token,
        message: 'Password reset successfully.'
    })
})