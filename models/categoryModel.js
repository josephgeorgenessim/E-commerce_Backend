const mongoose = require('mongoose')

// create schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category required'],
        unique: [true, 'Category must be unique'],
        minlength: [3, 'Too Short Category Name'],
        maxlength: [32, 'Too Long Category Name'],
    },
    // "A and B" ==> in URl "shoping.com/a-and-b"   this mean slug.
    slug: {
        type: String,
        lowercase: true
    },
    image: String , 

}, { timestamps: true })
// create model
const CategoryModel = mongoose.model('Category', categorySchema)


module.exports = CategoryModel;