const { param, check, body } = require('express-validator');
const validatorMIddleware = require('../../middleware/validatorMiddleware');
const { default: slugify } = require('slugify');

exports.getCategoryValidator = [
    param('id').isMongoId().withMessage('invalid category id format'),
    validatorMIddleware
]
exports.createCategoryValidator = [
    check("name").notEmpty().withMessage('Category name required')
        .isLength({ min: 3 }).withMessage('Too Short Category Name')
        .isLength({ max: 32 }).withMessage('Too Long Category Name'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMIddleware

]
exports.updateCategoryValidator = [
    param('id').isMongoId().withMessage('invalid category id format'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMIddleware
]
exports.deleteCategoryValidator = [
    param('id').isMongoId().withMessage('invalid category id format'),
    validatorMIddleware
]