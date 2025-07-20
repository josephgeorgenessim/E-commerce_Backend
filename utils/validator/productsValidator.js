const { param, check, body } = require('express-validator');
const Category = require('../../models/categoryModel');
const subCategory = require('../../models/subCategory');
const validatorMIddleware = require('../../middleware/validatorMiddleware');
const { default: slugify } = require('slugify');

exports.getProductValidator = [
    param('id').isMongoId().withMessage('invalid Product id format'),
    validatorMIddleware
]

exports.createProductValidator = [
    check('title')
        .notEmpty()
        .withMessage('Product title required')
        .isLength({ min: 3 })
        .withMessage('Too short product title (minimum 3 characters)')
        .isLength({ max: 32 })
        .withMessage('Too long product title (maximum 32 characters)'),

    check('description')
        .notEmpty()
        .withMessage('Product description required')
        .isLength({ min: 20 })
        .withMessage('Too short product description (minimum 20 characters)'),

    check('quantity')
        .notEmpty()
        .withMessage('Product quantity required')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a number greater than or equal to 0'),

    check('price')
        .notEmpty()
        .withMessage('Product price required')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a number greater than 0')
        .isLength({ max: 20 })
        .withMessage('Too long product price (maximum 20 characters when stringified)'),

    check('priceAfterDiscount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price after discount must be a valid number')
        .custom((value, { req }) => {
            if (value >= req.body.price) {
                throw new Error('Price after discount must be less than the original price');
            }
            return true;
        }),

    check('color')
        .optional()
        .isArray()
        .withMessage('Color must be an array of strings')
        .custom((value) => {
            if (!value.every((item) => typeof item === 'string')) {
                throw new Error('All colors must be strings');
            }
            return true;
        }),

    check('imageCover')
        .notEmpty()
        .withMessage('Product image cover required')
        .isURL()
        .withMessage('Image cover must be a valid URL'),

    check('image')
        .optional()
        .isArray()
        .withMessage('Images must be an array of URLs')
        .custom((value) => {
            if (!value.every((url) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url))) {
                throw new Error('All images must be valid URLs');
            }
            return true;
        }),

    check('category')
        .notEmpty()
        .withMessage('Product category required')
        .isMongoId()
        .withMessage('Category must be a valid MongoDB ObjectId')
        .custom(async (categoryID) => {
            await Category.findById(categoryID).then((category) => {
                if (!category) {
                    throw new Error(`No category for this id ${categoryID}`)
                }
                return true
            })

        }),

    check('subCategory')
        .optional()
        .isMongoId()
        .withMessage('SubCategory must be a valid MongoDB ObjectId')
        .custom(async (subCategoriesID) => {
            if (subCategoriesID.length === 0) {
                throw new Error('subCategory array cannot be empty if provided');
            }
            await subCategory.find({ _id: { $exists: true, $in: subCategoriesID } }).then((category) => {
                if (category.length < 1 || category.length !== subCategoriesID.length) {
                    throw new Error(`No category for this ids ${subCategoriesID}`)
                }
                return true
            })
        })
        .custom(async (val, { req }) => {
            await subCategory.find({ category: req.body.category }).then((subcategory) => {
                const subCategoriesIDInDB = []
                subcategory.forEach(Subategory => {
                    subCategoriesIDInDB.push(Subategory._id.toString())
                })
                if (!val.every((v) => subCategoriesIDInDB.includes(v))) {
                    throw new Error(`subCategories not belong to category`)
                }
            })

        })
    ,

    check('brand')
        .optional()
        .isMongoId()
        .withMessage('Brand must be a valid MongoDB ObjectId'),

    check('ratingsAverage')
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings average must be between 1 and 5'),

    check('ratingsQuantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Ratings quantity must be a number greater than or equal to 0'),
    body('title').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),

    validatorMIddleware,
];
exports.updateProductValidator = [
    param('id').isMongoId().withMessage('invalid Product id format'),
    body().custom((value, { req }) => {
        if (Object.keys(req.body).length === 0) {
            throw new Error('Request body cannot be empty. At least one field must be provided to update the product.');
        }
        return true;
    }),
    body('title').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMIddleware
]
exports.deleteProductValidator = [
    param('id').isMongoId().withMessage('invalid Product id format'),
    validatorMIddleware
]