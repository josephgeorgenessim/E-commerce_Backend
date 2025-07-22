const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');
const sharp = require('sharp');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');


//  upload single image 
exports.uploadCategoryImage = uploadSingleImage('image')

// Resize image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `category-${Math.random()}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/${fileName}`)

    // save image into db
    req.body.image = fileName;

    next()
})


// @desc    Get List of categories
// @route   GET /api/v1/categories
// @access  public
exports.getCategories = factory.getAll(Category, "Category")

// @desc    Get specific category
// @route   GET /api/v1/categories/:id
// @access  public
exports.getCategory = factory.getOne(Category, "Category")


// @desc    Create Category
// @route   POST /api/v1/categories
// @access  private
exports.createCategory = factory.create(Category, "Category")


// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  private
exports.updateCategory = factory.updateOne(Category, "Category")


// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  private
exports.deleteCategory = factory.deleteOne(Category)
