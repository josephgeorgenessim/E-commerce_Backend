const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    CartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: Number,
            color: String,
            price: Number
        }
    ],
    taxPrice: Number,
    shippingAddress: {
        address: String,
        phone: String,
        city: String,
        postalCode: String,
    },
    shippingPrice: Number,
    totalOrderPrice: Number,
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,
}, { timestamps: true })


orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name profileImage email phone '
    }).populate({
        path: 'CartItems.product',
        select: 'title imageCover'
    })
    next()
})

module.exports = mongoose.model('Order', orderSchema)
