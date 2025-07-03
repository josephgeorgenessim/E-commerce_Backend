const { param, check } = require('express-validator');
const validatorMIddleware = require('../../middleware/validatorMiddleware');

exports.getBrandValidator = [
    param('id').isMongoId().withMessage('invalid Brand id format'),
    validatorMIddleware
]
exports.createBrandValidator = [
    check("name").notEmpty().withMessage('Brand name required')
        .isLength({ min: 2 }).withMessage('Too Short Brand Name')
        .isLength({ max: 32 }).withMessage('Too Long Brand Name'),
    validatorMIddleware
]
exports.updateBrandValidator = [
    param('id').isMongoId().withMessage('invalid Brand id format'),
    validatorMIddleware
]
exports.deleteBrandValidator = [
    param('id').isMongoId().withMessage('invalid Brand id format'),
    validatorMIddleware
]