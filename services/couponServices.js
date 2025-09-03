const Coupon = require('../models/couponModel');
const factory = require('./handlerFactory');




// @desc    Get List of Coupons
// @route   GET /api/v1/coupons
// @access  public
exports.getCoupons = factory.getAll(Coupon, "Coupon")

// @desc    Get specific Coupon
// @route   GET /api/v1/coupons/:id
// @access  public
exports.getCoupon = factory.getOne(Coupon, "Coupon")


// @desc    Create Coupon
// @route   POST /api/v1/coupons
// @access  private
exports.createCoupon = factory.create(Coupon, "Coupon")


// @desc    Update specific Coupon
// @route   PUT /api/v1/coupons/:id
// @access  private

exports.updateCoupon = factory.updateOne(Coupon, "Coupon")


// @desc    Delete specific Coupon
// @route   DELETE /api/v1/coupons/:id
// @access  private
exports.deleteCoupon = factory.deleteOne(Coupon)
