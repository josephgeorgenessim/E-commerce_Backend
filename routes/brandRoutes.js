const express = require('express');
const { getBrands, createBrand, getBrand, updateBrand, deleteBrand, uploadBrandImage, resizeImage } = require('../services/brandServices');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../utils/validator/brandValidator');

const { protect, allowedTo } = require('../services/authServices')

const router = express.Router();
// router.use('/:categoryId/subcategories', subCategoryRoute)
router.route('/').get(getBrands).post(protect, allowedTo('admin'), uploadBrandImage, resizeImage, createBrandValidator, createBrand);
router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(protect, allowedTo('admin'), uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
    .delete(protect, allowedTo('admin'), deleteBrandValidator, deleteBrand);

module.exports = router;