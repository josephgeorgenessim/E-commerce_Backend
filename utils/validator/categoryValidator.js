const { param, check } = require('express-validator');
const validatorMIddleware = require('../../middleware/validatorMiddleware');

exports.getCategoryValidator = [
    param('id').isMongoId().withMessage('invalid category id format'),
    validatorMIddleware
]
exports.createCategoryValidator = [
    check("name").notEmpty().withMessage('Category name required')
        .isLength({ min: 3 }).withMessage('Too Short Category Name')
        .isLength({ max: 32 }).withMessage('Too Long Category Name'),
    validatorMIddleware
]
exports.updateCategoryValidator = [
    param('id').isMongoId().withMessage('invalid category id format'),
    validatorMIddleware
]
exports.deleteCategoryValidator = [
    param('id').isMongoId().withMessage('invalid category id format'),
    validatorMIddleware
]