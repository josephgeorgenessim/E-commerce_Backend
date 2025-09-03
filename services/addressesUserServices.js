const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');


// @desc    Add address to user addresses
// @route   POST /api/v1/addresses
// @access  protected / user
exports.addAddress = asyncHandler(async (req, res, next) => {
    const userhere = await User.findById(req.user._id)
    if (!userhere) {
        return next(new ApiError('User not found', 404))
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { addresses: req.body }
    },
        { new: true }
    )
    res.status(200).json({
        status: 'success',
        message: 'Address added successfully',
        addresses: user.addresses
    })
})


// @desc    Remove address from user addresses
// @route   DELETE /api/v1/addresses/:addressId
// @access  protected / user
exports.removeAddress = asyncHandler(async (req, res, next) => {
    const userhere = await User.findById(req.user._id)
    if (!userhere) {
        return next(new ApiError('User not found', 404))
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { addresses: { _id: req.params.addressId } }
    },
        { new: true }
    )

    res.status(200).json({
        status: 'success',
        message: 'Address removed successfully',
        addresses: user.addresses
    })
})

// @desc    Get logged in user addresses
// @route   GET /api/v1/addresses
// @access  protected / user
exports.getUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('addresses')
    if (!user) {
        return next(new ApiError('User not found', 404))
    }
    res.status(200).json({
        status: 'success',
        totalItems: user.addresses.length,
        addresses: user.addresses
    })
})
