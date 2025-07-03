const express = require('express');
const { getBrands, createBrand, getBrand, updateBrand, deleteBrand } = require('../services/brandServices');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../utils/validator/brandValidator');

const router = express.Router();
// router.use('/:categoryId/subcategories', subCategoryRoute)
router.route('/').get(getBrands).post(createBrandValidator, createBrand);
router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;