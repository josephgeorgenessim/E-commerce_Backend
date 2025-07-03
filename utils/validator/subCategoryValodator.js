const { param, check } = require('express-validator');
const validatorMIddleware = require('../../middleware/validatorMiddleware');

exports.getSpecificCategoryValidator = [
    param('id').isMongoId().withMessage('invalid subcategory id format'),
    validatorMIddleware
]
exports.createSubCategoryValidator = [
    check("name").notEmpty().withMessage('subcategory name required')
        .isLength({ min: 2 }).withMessage('Too Short subcategory Name')
        .isLength({ max: 32 }).withMessage('Too Long subcategory Name'),
    check('category').notEmpty().withMessage('subcategory must be belong to category').isMongoId().withMessage('invalid category id format'),
    validatorMIddleware
]
exports.updateSubCategoryValidator = [
    param('id').isMongoId().withMessage('invalid subcategory id format'),
    validatorMIddleware
]
exports.deleteSubCategoryValidator = [
    param('id').isMongoId().withMessage('invalid subcategory id format'),
    validatorMIddleware
]