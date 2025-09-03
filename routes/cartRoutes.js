const express = require('express');
const { protect, allowedTo } = require('../services/authServices');
const { addProductToCart, removeProductFromCart, getUserCart, updateProductQuantityInCart, clearCart } = require('../services/cartServices');

const router = express.Router();
router.route('/clear').delete(protect, allowedTo('user'), clearCart)


router.route('/').get(protect, allowedTo('user'), getUserCart).post(protect, allowedTo('user'), addProductToCart)
router.route('/:itemId').delete(protect, allowedTo('user'), removeProductFromCart).put(protect, allowedTo('user'), updateProductQuantityInCart)
module.exports = router
