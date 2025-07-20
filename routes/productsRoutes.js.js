const express = require('express');
const { getProducts, createProduct, getProduct, deleteProduct, updateProduct } = require('../services/productServices');
const { createProductValidator, getProductValidator, deleteProductValidator, updateProductValidator } = require('../utils/validator/productsValidator');

const router = express.Router();

router.route('/').get(getProducts).post(createProductValidator, createProduct)
router.route('/:id').get(getProductValidator, getProduct).delete(deleteProductValidator, deleteProduct).put(updateProductValidator, updateProduct)
module.exports = router;