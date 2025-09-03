const express = require('express');
const { protect, allowedTo } = require('../services/authServices');
const { addProductToWishlist, removeProductFromWishlist, getUserWishlist } = require('../services/wishlistService');


const router = express.Router();

router.route('/').get(protect, allowedTo('user'), getUserWishlist).post(protect, allowedTo('user'), addProductToWishlist)
router.route('/:productId').delete(protect, allowedTo('user'), removeProductFromWishlist)
module.exports = router;