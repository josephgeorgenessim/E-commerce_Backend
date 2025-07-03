const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');
const ApiError = require('../utils/apiError');

// @desc    Get List of Brands
// @route   GET /api/v1/brands
// @access  public
exports.getBrands = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    const Brands = await Brand.find({}).skip(skip).limit(limit)
    res.status(200).json({
        Brands: Brands,
        page: page,
        total: Brands.length,
    })
})

// @desc    Get specific Brand
// @route   GET /api/v1/brands/:id
// @access  public
exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const brand = await Brand.findById(id)
    if (!brand) {
        return next(new ApiError(`no brand for this id ${id}`, 404))
    }
    res.status(200).json({
        Brand: brand,
    })
})


// @desc    Create brand
// @route   POST /api/v1/brands
// @access  private
exports.createBrand = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const brand = await Brand.create({ name, slug: slugify(name) });
    res.status(201).json({ Brand: brand })
})


// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  private
exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const {name} = req.body

    const brand = await Brand.findOneAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true })
    if (!brand) {
        return next(new ApiError(`no brand for this id ${id}`, 404))
    }
    res.status(200).json({
        Brand: brand,
    })
})
// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const brand = await Brand.findByIdAndDelete(id)
    if (!brand) {
        return next(new ApiError(`no brand for this id ${id}`, 404))
    }
    res.status(200).json({
        msg: `Deleted Brand `
    })
})