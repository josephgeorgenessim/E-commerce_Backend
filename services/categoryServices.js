const slugify = require('slugify');
const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler')

// @desc    Get List of categories
// @route   GET /api/categories
// @access  public
exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    const categories = await Category.find({}).skip(skip).limit(limit)
    res.status(200).json({
        data: categories,
        page: page,
        total: categories.length,
    })
})

// @desc    Get specific category
// @route   GET /api/categories/:id
// @access  public
exports.getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) {
        res.status(404).json({ msg: "ID Invalid" })
    }
    res.status(200).json({
        data: category,
    })
})


// @desc    Create Category
// @route   POST /api/categories
// @access  private
exports.createCategory = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const category = await Category.create({ name, slug: slugify(name) });
    res.status(201).json({ data: category })
})


// @desc    Update specific category
// @route   PUT /api/categories/:id
// @access  private
exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const name = req.body.name

    const category = await Category.findOneAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true })
    if (!category) {
        res.status(404).json({ msg: "ID Invalid" })
    }
    res.status(200).json({
        data: category,
    })
})
// @desc    Delete specific category
// @route   DELETE /api/categories/:id
// @access  private
exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params

    const category = await Category.findByIdAndDelete(id)
    if (!category) {
        res.status(404).json({ msg: "ID Invalid" })
    }
    res.status(200).json({
        msg : `Deleted Category `
    })
})