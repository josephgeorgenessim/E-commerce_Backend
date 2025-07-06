const mongoose = require('mongoose')

// create schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title product required'],
        trim: true,
        unique: [true, 'product must be unique'],
        minlength: [3, 'Too Short product title'],
        maxlength: [32, 'Too Long product title'],
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    description: {
        type: String,
        required: [true, 'description product required'],
        minlength: [20, 'Too Short product description'],
    },
    quantity: {
        type: Number,
        required: [true, 'quantity product required'],
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'price product required'],
        trim: true
    },
    image: String,

}, { timestamps: true })
// create model
const ProductModel = mongoose.model('Product', productSchema)


module.exports = ProductModel;