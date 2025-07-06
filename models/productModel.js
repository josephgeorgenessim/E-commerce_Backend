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
        trim: true,
        maxlength: [20, "Too Long product price"]
    },
    priceAfterDiscount: {
        type: Number
    },
    color: [String],
    imageCover: {
        type: String,
        required: [true, "Product image cover is required "]
    },
    image: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product must be belong to category  ']
    },
    subCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'subCategory',
    },
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    }

}, { timestamps: true })
// create model
const ProductModel = mongoose.model('Product', productSchema)


module.exports = ProductModel;