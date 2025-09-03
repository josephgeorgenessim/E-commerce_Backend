const express = require('express');
const { getReviews, createReview, getReview, updateReview, deleteReview, SetProductIdFromParams, setProductIdFromParamsToBody } = require('../services/reviewServices');

const { protect, allowedTo } = require('../services/authServices');
const { createReviewValidator, updateReviewValidator, getReviewValidator } = require('../utils/validator/reviewValidator');

const router = express.Router({ mergeParams: true });

router.route('/').get(SetProductIdFromParams, getReviews).post(protect, allowedTo('user','admin'), setProductIdFromParamsToBody, createReviewValidator, createReview);
router.route('/:id')
    .get(getReviewValidator, getReview)
    .put(protect, allowedTo('admin'), updateReviewValidator, updateReview)
    .delete(protect, allowedTo('admin'), deleteReview);


module.exports = router;