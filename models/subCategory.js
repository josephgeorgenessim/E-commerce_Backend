const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, 'subcategory should be unique'],
        minlength: [2, 'Too Short subcategory name'],
        maxlength: [32, 'Too Long subcategory name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'subcategory must be belong to category '],
    }
}, { timestamps: true });

const subCategoryModel = mongoose.model('subCategory', subCategorySchema)

module.exports = subCategoryModel