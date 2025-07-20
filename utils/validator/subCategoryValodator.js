const { param, check, body } = require('express-validator');
const validatorMIddleware = require('../../middleware/validatorMiddleware');
const { default: slugify } = require('slugify');

exports.getSpecificCategoryValidator = [
    param('id').isMongoId().withMessage('invalid subcategory id format'),
    validatorMIddleware
]
exports.createSubCategoryValidator = [
    check("name").notEmpty().withMessage('subcategory name required')
        .isLength({ min: 2 }).withMessage('Too Short subcategory Name')
        .isLength({ max: 32 }).withMessage('Too Long subcategory Name'),
    check('category').notEmpty().withMessage('subcategory must be belong to category').isMongoId().withMessage('invalid category id format'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMIddleware
]
exports.updateSubCategoryValidator = [
    param('id').isMongoId().withMessage('invalid subcategory id format'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMIddleware
]
exports.deleteSubCategoryValidator = [
    param('id').isMongoId().withMessage('invalid subcategory id format'),
    validatorMIddleware
]