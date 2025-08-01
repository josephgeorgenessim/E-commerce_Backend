const express = require('express');
const { uploadProductImages, resizeImage, getProducts, createProduct, getProduct, deleteProduct, updateProduct } = require('../services/productServices');
const { createProductValidator, getProductValidator, deleteProductValidator, updateProductValidator } = require('../utils/validator/productsValidator');

const { protect, allowedTo } = require('../services/authServices')

const router = express.Router();

router.route('/').get(getProducts).post(protect, allowedTo('admin'), uploadProductImages, resizeImage, createProductValidator, createProduct)
router.route('/:id').get(getProductValidator, getProduct).delete(protect, allowedTo('admin'), deleteProductValidator, deleteProduct).put(protect, allowedTo('admin'), uploadProductImages, resizeImage, updateProductValidator, updateProduct)
module.exports = router; 