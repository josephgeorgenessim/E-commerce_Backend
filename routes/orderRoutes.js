const express = require('express');
const { protect, allowedTo } = require('../services/authServices');
const { createCashOrder, findAllOrders, findSpecificOrder, filterOrderByLogin, updateOrderToPaid, updateOrderToDelivered, checkoutSession } = require('../services/orderServices');

const router = express.Router();


router.route('/checkout-session/:cartId').get(protect, allowedTo('user'), checkoutSession)


router.route('/:cartId').post(protect, allowedTo('user'), createCashOrder)

router.route('/:id').get(findSpecificOrder)
router.route('/').get(protect, allowedTo('admin', 'user'), filterOrderByLogin, findAllOrders)

router.route('/:id/paid').put(protect, allowedTo('admin'), updateOrderToPaid)
router.route('/:id/delivered').put(protect, allowedTo('admin'), updateOrderToDelivered)

module.exports = router
