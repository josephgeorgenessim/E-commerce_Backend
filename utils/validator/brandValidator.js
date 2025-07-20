const { param, check, body } = require('express-validator');
const validatorMIddleware = require('../../middleware/validatorMiddleware');
const { default: slugify } = require('slugify');

exports.getBrandValidator = [
    param('id').isMongoId().withMessage('invalid Brand id format'),
    validatorMIddleware
]
exports.createBrandValidator = [
    check("name").notEmpty().withMessage('Brand name required')
        .isLength({ min: 2 }).withMessage('Too Short Brand Name')
        .isLength({ max: 32 }).withMessage('Too Long Brand Name'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMIddleware
]
exports.updateBrandValidator = [
    param('id').isMongoId().withMessage('invalid Brand id format'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMIddleware
]
exports.deleteBrandValidator = [
    param('id').isMongoId().withMessage('invalid Brand id format'),
    validatorMIddleware
]