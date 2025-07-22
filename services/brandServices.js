const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');
const sharp = require('sharp');




//  upload single image 
exports.uploadBrandImage = uploadSingleImage('image')

// Resize image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `brand-${Math.random()}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/brands/${fileName}`)

    // save image into db
    req.body.image = fileName;

    next()
})


// @desc    Get List of Brands
// @route   GET /api/v1/brands
// @access  public
exports.getBrands = factory.getAll(Brand, "Brand")

// @desc    Get specific Brand
// @route   GET /api/v1/brands/:id
// @access  public
exports.getBrand = factory.getOne(Brand, "Brand")


// @desc    Create brand
// @route   POST /api/v1/brands
// @access  private
exports.createBrand = factory.create(Brand, "Brand")


// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  private

exports.updateBrand = factory.updateOne(Brand, "Brand")


// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  private
exports.deleteBrand = factory.deleteOne(Brand)
