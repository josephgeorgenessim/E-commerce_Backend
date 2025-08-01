const express = require('express');
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory, uploadCategoryImage, resizeImage } = require('../services/categoryServices');
const { getCategoryValidator, updateCategoryValidator, deleteCategoryValidator, createCategoryValidator } = require('../utils/validator/categoryValidator');
const { protect } = require('../services/authServices')
const subCategoryRoute = require('./subCategoryRoutes');

const router = express.Router();
router.use('/:categoryId/subcategories', subCategoryRoute)
router.route('/').get(getCategories).post(protect, uploadCategoryImage, resizeImage, createCategoryValidator, createCategory);
router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;