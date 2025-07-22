const express = require('express');
const { getBrands, createBrand, getBrand, updateBrand, deleteBrand, uploadBrandImage, resizeImage } = require('../services/brandServices');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../utils/validator/brandValidator');

const router = express.Router();
// router.use('/:categoryId/subcategories', subCategoryRoute)
router.route('/').get(getBrands).post(uploadBrandImage, resizeImage, createBrandValidator, createBrand);
router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;