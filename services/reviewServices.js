const asyncHandler = require('express-async-handler');
const Review = require('../models/ReviewModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');



// nested route
// @desc    Get List of reviews
// @route   GET /api/v1/products/:productId/reviews
// @access  public
exports.SetProductIdFromParams = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) {
        filterObject = { product: req.params.productId };
    }
    req.filterObj = filterObject;
    next();
}


// nested route
// @desc    Create Review
// @route   POST /api/v1/products/:productId/reviews
// @access  private
exports.setProductIdFromParamsToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId
    if (!req.body.user) req.body.user = req.user._id
    next()
}


// @desc    Get List of Reviews
// @route   GET /api/v1/Reviews
// @access  public
exports.getReviews = factory.getAll(Review, "Review")


// @desc    Get specific Review
// @route   GET /api/v1/Reviews/:id
// @access  public
exports.getReview = factory.getOne(Review, "Review")


// @desc    Create Review
// @route   POST /api/v1/Reviews
// @access  private
exports.createReview = factory.create(Review, "Review")


// @desc    Update specific Review
// @route   PUT /api/v1/Reviews/:id
// @access  private
exports.updateReview = factory.updateOne(Review, "Review")


// @desc    Delete specific Review
// @route   DELETE /api/v1/Reviews/:id
// @access  private
exports.deleteReview = factory.deleteOne(Review)
