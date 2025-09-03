const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
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
            quantity: {
                type: Number,
                default: 1
            },
            color: String,
            price: Number
        }
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number
}, { timestamps: true })

const CartModel = mongoose.model('Cart', cartSchema)

module.exports = CartModel
