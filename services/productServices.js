const asyncHandler = require('express-async-handler');
const Products = require('../models/productModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');
const sharp = require('sharp');
const { uploadMultiImages } = require('../middleware/uploadImageMiddleware');



// @desc Upload Product images
exports.uploadProductImages = uploadMultiImages([
    {
        name: "imageCover",
        maxCount: 1
    },
    {
        name: "images",
        maxCount: 4
    }
])

// @desc Resize Product images
exports.resizeImage = asyncHandler(async (req, res, next) => {
    // image Cover process
    if (req.files.imageCover) {
        const imageCoverFileName = `product-cover-${Math.random()}-${Date.now()}.jpeg`

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${imageCoverFileName}`)

        // save image into db
        req.body.imageCover = imageCoverFileName;
    }

    // images process
    if (req.files.images) {
        req.body.images = []
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const imageFileName = `product-image-${Math.random()}-${Date.now()}-${index + 1}.jpeg`

                await sharp(img.buffer)
                    .resize(600, 600)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`uploads/products/${imageFileName}`)

                // save image into db
                req.body.images.push(imageFileName)
            })
        );

        next()
    }
})


// @desc    Get List of Products
// @route   GET /api/v1/products
// @access  public
exports.getProducts = factory.getAll(Products, "Products")


// @desc    Get specific Product
// @route   GET /api/v1/products/:id
// @access  public
exports.getProduct = factory.getOne(Products, "Products")


// @desc    Create product
// @route   POST /api/v1/products
// @access  private
exports.createProduct = factory.create(Products, "Products")


// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  private
exports.updateProduct = factory.updateOne(Products, "Products")


// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  private
exports.deleteProduct = factory.deleteOne(Products)
