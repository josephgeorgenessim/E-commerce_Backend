const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

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
