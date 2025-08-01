const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');
const sharp = require('sharp');
const bcrypt = require('bcrypt')




//  upload single image 
exports.uploadUserImage = uploadSingleImage('profileImage')

// Resize image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `user-${Math.random()}-${Date.now()}.jpeg`

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/users/${fileName}`)

    }
    // save image into db
    req.body.image = fileName;

    next()
})


// @desc    Get List of Users
// @route   GET /api/v1/Users
// @access  private
exports.getUsers = factory.getAll(User, "User")

// @desc    Get specific User
// @route   GET /api/v1/Users/:id
// @access  private
exports.getUser = factory.getOne(User, "User")


// @desc    Create User
// @route   POST /api/v1/Users
// @access  private
exports.createUser = factory.create(User, "User")


// @desc    Update specific User
// @route   PUT /api/v1/Users/:id
// @access  private

exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            profileImage: req.body.profileImage,
            role: req.body.role,
        },
        { new: true }
    );
    if (!document) {
        return next(new ApiError(`no User document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        User: document,
    })
})

// @desc    Change User Password
// @route   PUT /api/v1/Users/changePassword/:id
// @access  private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {

    const document = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
            password: await bcrypt.hash(req.body.password, 12)
        },
        { new: true }
    );
    if (!document) {
        return next(new ApiError(`no User document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        User: document,
    })
})

// @desc    Delete specific User
// @route   DELETE /api/v1/Users/:id
// @access  private
exports.deleteUser = factory.deleteOne(User)
