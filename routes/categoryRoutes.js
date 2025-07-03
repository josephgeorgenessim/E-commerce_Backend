const express = require('express');
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory } = require('../services/categoryServices');
const { getCategoryValidator, updateCategoryValidator, deleteCategoryValidator, createCategoryValidator } = require('../utils/validator/categoryValidator');
const subCategoryRoute = require('./subCategoryRoutes');

const router = express.Router();
router.use('/:categoryId/subcategories', subCategoryRoute)
router.route('/').get(getCategories).post(createCategoryValidator, createCategory);
router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;