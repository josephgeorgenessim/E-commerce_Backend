const { default: slugify } = require("slugify");
const asyncHandler = require('express-async-handler');
const subCategoryModel = require("../models/subCategory");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require('./handlerFactory');



// @desc    Get List of subcategories
// @route   GET /api/v1/subcategories
// @access  public
exports.SetCategoryIdFromParams = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) {
        filterObject = { category: req.params.categoryId };
    }
    req.filterObj = filterObject;
    next();
}

exports.getSubCategories = factory.getAll(subCategoryModel, "subCategory")

// @desc    Create subCategory
// @route   POST /api/v1/subcategories
// @access  private
exports.setCategoryIdFromParamsToBody = (req, res, next) => {
    // Nested route
    if (!req.body.category) req.body.category = req.params.categoryId
    next()
}
exports.createSubCategory = factory.create(subCategoryModel, "subCategory")


// @desc    Get specific of subcategories
// @route   GET /api/v1/subcategories/:id
// @access  public
exports.getSpecificSubCategories = factory.getOne(subCategoryModel, "subCategory")


// @desc    PUT specific of subcategories
// @route   PUT /api/v1/subcategories/:id
// @access  private
exports.updateSpecificSubCategories = factory.updateOne(subCategoryModel, "subCategory")
// @desc    DELETE specific of subcategories
// @route   DELETE /api/v1/subcategories/:id
// @access  private

exports.deleteSpecificSubCategories = factory.deleteOne(subCategoryModel)
