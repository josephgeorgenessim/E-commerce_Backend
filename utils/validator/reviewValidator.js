const { param, check } = require('express-validator');
const validatorMIddleware = require('../../middleware/validatorMiddleware');
const ProductModel = require('../../models/productModel');
const ReviewModel = require('../../models/ReviewModel');

exports.getReviewValidator = [
    param('id').isMongoId().withMessage('invalid Review id format'),
    validatorMIddleware
]

exports.createReviewValidator = [
    check("user").notEmpty().withMessage('User required'),
    check("product")
        .notEmpty()
        .withMessage('Product required')
        .custom(async (val, { req }) => {
            // Check if product exists
            const product = await ProductModel.findById(val);
            if (!product) {
                throw new Error('Product not found');
            }

            // Check if user already reviewed this product
            const existingReview = await ReviewModel.findOne({
                user: req.user._id,
                product: val
            });

            if (existingReview) {
                throw new Error('You have already reviewed this product');
            }

            return true;
        }),
    check("ratings").notEmpty().withMessage('Rating required')
        .isLength({ min: 1 }).withMessage('Too Short Review Rating')
        .isLength({ max: 5 }).withMessage('Too Long Review Rating'),
    check("comment").notEmpty().withMessage('Comment required'),
    validatorMIddleware
]

exports.updateReviewValidator = [
    param('id').isMongoId().withMessage('invalid Review id format').custom(async (val, { req }) => {
        const review = await ReviewModel.findById(val);
        // check if review exists
        if (!review) {
            throw new Error('Review not found');
        }

        // check if user is the owner of the review
        if (review.user._id.toString() !== req.user._id.toString()) {
            throw new Error('You are not authorized to update this review');
        }

        return true;
    }),
    validatorMIddleware
]

exports.deleteReviewValidator = [
    param('id').isMongoId().withMessage('invalid Review id format').custom(async (val, { req }) => {
        const review = await ReviewModel.findById(val);
        // check if review exists
        if (!review) {
            throw new Error('Review not found');
        }

        if(req.user.role !== 'admin' && review.user._id.toString() !== req.user._id.toString()) {
            throw new Error('You are not authorized to delete this review');
        }

        return true;
    }),
    validatorMIddleware
]