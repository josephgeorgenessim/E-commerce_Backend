const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

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
