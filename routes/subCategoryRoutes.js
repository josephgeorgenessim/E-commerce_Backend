const express = require('express');
const { createSubCategory, getSubCategories, getSpecificSubCategories, updateSpecificSubCategories, deleteSpecificSubCategories, setCategoryIdFromParams, SetCategoryIdFromParams, setCategoryIdFromParamsToBody } = require('../services/subCategoryServices');
const { createSubCategoryValidator, getSpecificCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('../utils/validator/subCategoryValodator');

// mergeParams : allows us to access parameters on other routers 
const router = express.Router({ mergeParams: true });


router.route('/').get(SetCategoryIdFromParams, getSubCategories).post(setCategoryIdFromParamsToBody, createSubCategoryValidator, createSubCategory)
router.route('/:id').get(getSpecificCategoryValidator, getSpecificSubCategories).put(updateSubCategoryValidator, updateSpecificSubCategories).delete(deleteSubCategoryValidator, deleteSpecificSubCategories)
module.exports = router;