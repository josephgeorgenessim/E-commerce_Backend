const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const ApiError = require('../utils/apiError');

// @desc    Get List of categories
// @route   GET /api/v1/categories
// @access  public
exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    const categories = await Category.find({}).skip(skip).limit(limit)
    res.status(200).json({
        categories: categories,
        page: page,
        total: categories.length,
    })
})

// @desc    Get specific category
// @route   GET /api/v1/categories/:id
// @access  public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) {
        return next(new ApiError(`no category for this id ${id}`, 404))
    }
    res.status(200).json({
        data: category,
    })
})


// @desc    Create Category
// @route   POST /api/v1/categories
// @access  private
exports.createCategory = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const category = await Category.create({ name, slug: slugify(name) });
    res.status(201).json({ data: category })
})


// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  private
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const {name} = req.body

    const category = await Category.findOneAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true })
    if (!category) {
        return next(new ApiError(`no category for this id ${id}`, 404))
    }
    res.status(200).json({
        data: category,
    })
})
// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const category = await Category.findByIdAndDelete(id)
    if (!category) {
        return next(new ApiError(`no category for this id ${id}`, 404))
    }
    res.status(200).json({
        msg: `Deleted Category `
    })
})