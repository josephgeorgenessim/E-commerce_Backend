const express = require('express');
const { uploadProductImages, resizeImage, getProducts, createProduct, getProduct, deleteProduct, updateProduct } = require('../services/productServices');
const { createProductValidator, getProductValidator, deleteProductValidator, updateProductValidator } = require('../utils/validator/productsValidator');

const router = express.Router();

router.route('/').get(getProducts).post(uploadProductImages, resizeImage, createProductValidator, createProduct)
router.route('/:id').get(getProductValidator, getProduct).delete(deleteProductValidator, deleteProduct).put(uploadProductImages, resizeImage, updateProductValidator, updateProduct)
module.exports = router; 