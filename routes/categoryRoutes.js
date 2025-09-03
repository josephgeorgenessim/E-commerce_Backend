const express = require('express');
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory, uploadCategoryImage, resizeImage } = require('../services/categoryServices');
const { getCategoryValidator, updateCategoryValidator, deleteCategoryValidator, createCategoryValidator } = require('../utils/validator/categoryValidator');
const { protect, allowedTo } = require('../services/authServices')
const subCategoryRoute = require('./subCategoryRoutes');

const router = express.Router();
// nested route
router.use('/:categoryId/subcategories', subCategoryRoute)

router.route('/').get(getCategories).post(protect, allowedTo('admin'), uploadCategoryImage, resizeImage, createCategoryValidator, createCategory);
router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(protect, allowedTo('admin'), uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
    .delete(protect, allowedTo('admin'), deleteCategoryValidator, deleteCategory);

module.exports = router;