const express = require('express');
const { protect, allowedTo } = require('../services/authServices'); 
const { getCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon } = require('../services/couponServices');
const router = express.Router();

router.use(protect, allowedTo('admin'));
router.route('/').get(getCoupons).post(createCoupon)
router.route('/:id').get(getCoupon).put(updateCoupon).delete(deleteCoupon)

module.exports = router