const { default: slugify } = require("slugify");
const asyncHandler = require('express-async-handler');
const subCategoryModel = require("../models/subCategory");
const ApiError = require("../utils/apiError");



// @desc    Get List of subcategories
// @route   GET /api/v1/subcategories
// @access  public
exports.SetCategoryIdFromParams = (req, res, next) => {
    let filterObject = {}
    if (req.params.categoryId) {
        filterObject = { category: req.params.categoryId }
    }
    req.filterObj = filterObject;
    next()
}

exports.getSubCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit

    const subCategories = await subCategoryModel.find(req.filterObj).skip(skip).limit(limit)
    res.status(200).json({
        subCategories: subCategories,
        page: page,
        total: subCategories.length,
    })
})

// @desc    Create subCategory
// @route   POST /api/v1/subcategories
// @access  private
exports.setCategoryIdFromParams = (req, next) => {
    // Nested route
    if (!req.body.category) req.body.category = req.params.categoryId
    next()
}
exports.createSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
    const subCategory = await subCategoryModel.create({
        name,
        slug: slugify(name),
        category
    });
    res.status(201).json({ data: subCategory })
})


// @desc    Get specific of subcategories
// @route   GET /api/v1/subcategories/:id
// @access  public
exports.getSpecificSubCategories = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Example used populate
    // const subCategories = await subCategoryModel.findById(id).populate({ path: 'category', select: 'name -_id' })
    const subCategories = await subCategoryModel.findById(id)
    if (!subCategories) {
        return next(new ApiError(`no category for this id ${id}`, 404))
    }
    res.status(200).json({
        subCategory: subCategories,
    })
})


// @desc    PUT specific of subcategories
// @route   PUT /api/v1/subcategories/:id
// @access  private
exports.updateSpecificSubCategories = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;
    const subCategories = await subCategoryModel.findById(id)
    if (!subCategories) {
        return next(new ApiError(`no category for this id ${id}`, 404))
    }
    const updateSubCategory = await subCategoryModel.findOneAndUpdate(
        { _id: id },
        {
            name: name,
            slug: slugify(name),
            category: category
        },
        { new: true }
    )
    res.status(200).json({
        subCategory: updateSubCategory,
    })
})
// @desc    DELETE specific of subcategories
// @route   DELETE /api/v1/subcategories/:id
// @access  private
exports.deleteSpecificSubCategories = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategories = await subCategoryModel.findByIdAndDelete(id)
    if (!subCategories) {
        return next(new ApiError(`no category for this id ${id}`, 404))
    }
    res.status(200).json({
        msg: `Deleted subcategory : ${subCategories.name}`,
    })
})
