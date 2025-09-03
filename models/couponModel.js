const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Coupon name required'],
        unique: [true, 'Coupon name must be unique'],
    },
    discount: {
        type: Number,
        required: [true, 'Coupon discount required'],
        min: [0, 'Coupon discount must be at least 0'],
        max: [100, 'Coupon discount must be at most 100'],
    },
    expiryDate: {
        type: Date,
        required: [true, 'Coupon expiry date required'],
    },
}, { timestamps: true })

const CouponModel = mongoose.model('Coupon', couponSchema)

module.exports = CouponModel
