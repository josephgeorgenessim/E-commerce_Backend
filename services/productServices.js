const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Products = require('../models/productModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const { title } = require('process');
const factory = require('./handlerFactory');

// @desc    Get List of Products
// @route   GET /api/v1/products
// @access  public
exports.getProducts = factory.getAll(Products, "Products")


// @desc    Get specific Product
// @route   GET /api/v1/products/:id
// @access  public
exports.getProduct = factory.getOne(Products, "Products")


// @desc    Create product
// @route   POST /api/v1/products
// @access  private
exports.createProduct = factory.create(Products, "Products")


// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  private
exports.updateProduct = factory.updateOne(Products, "Products")


// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  private
exports.deleteProduct = factory.deleteOne(Products)
