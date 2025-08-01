const express = require('express');
const { createSubCategory, getSubCategories, getSpecificSubCategories, updateSpecificSubCategories, deleteSpecificSubCategories, setCategoryIdFromParams, SetCategoryIdFromParams, setCategoryIdFromParamsToBody } = require('../services/subCategoryServices');
const { createSubCategoryValidator, getSpecificCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('../utils/validator/subCategoryValodator');

const { protect, allowedTo } = require('../services/authServices')

// mergeParams : allows us to access parameters on other routers 
const router = express.Router({ mergeParams: true });


router.route('/').get(SetCategoryIdFromParams, getSubCategories).post(protect, allowedTo('admin'), setCategoryIdFromParamsToBody, createSubCategoryValidator, createSubCategory)
router.route('/:id').get(getSpecificCategoryValidator, getSpecificSubCategories).put(protect, allowedTo('admin'), updateSubCategoryValidator, updateSpecificSubCategories).delete(protect, allowedTo('admin'), deleteSubCategoryValidator, deleteSpecificSubCategories)
module.exports = router;