const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');
const ProductModel = require('../models/productModel');


// @desc    Add product to user wishlist
// @route   POST /api/v1/wishlist
// @access  protected / user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {


    const product = await ProductModel.findById(req.body.productId);
    const userWishlist = await User.findById(req.user._id);
    if (!product) {
        return next(new ApiError('Product not found', 404))
    }

    if (userWishlist.wishlist.includes(req.body.productId)) {
        return next(new ApiError('Product already in wishlist', 400))
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: req.body.productId }
    },
        { new: true }
    )

    if (!user) {
        return next(new ApiError('User not found', 404))
    }
    res.status(200).json({
        status: 'success',
        message: 'Product added to wishlist',
        wishlist: user.wishlist
    })
})


// @desc    Remove product from user wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  protected / user
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {

    const product = await ProductModel.findById(req.params.productId)
    const userWishlist = await User.findById(req.user._id)
    if (!product) {
        return next(new ApiError('Product not found', 404))
    }


    if (!userWishlist.wishlist.includes(req.params.productId)) {
        return next(new ApiError('Product not in wishlist', 400))
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.productId }
    },
        { new: true }
    )
    if (!user) {
        return next(new ApiError('User not found', 404))
    }
    res.status(200).json({
        status: 'success',
        message: 'Product removed from wishlist',
        wishlist: user.wishlist
    })
})


// @desc    Get logged in user wishlist
// @route   GET /api/v1/wishlist
// @access  protected / user
exports.getUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist')
    if (!user) {
        return next(new ApiError('User not found', 404))
    }
    res.status(200).json({
        status: 'success',
        totalItems: user.wishlist.length,
        wishlist: user.wishlist
    })
})