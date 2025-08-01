const { param, check, body } = require('express-validator');
const validatorMIddleware = require('../../middleware/validatorMiddleware');
const { default: slugify } = require('slugify');
const UserModel = require('../../models/userModel');
const ApiError = require('../apiError');
const bcrypt = require('bcrypt')

exports.getUserValidator = [
    param('id').isMongoId().withMessage('invalid User id format'),
    validatorMIddleware
]
exports.createUserValidator = [
    check("name").notEmpty().withMessage('User name required')
        .isLength({ min: 2 }).withMessage('Too Short User Name')
        .isLength({ max: 32 }).withMessage('Too Long User Name'),
    check('email').notEmpty().withMessage('Email required')
        .isEmail().withMessage('Invalid email address')
        .custom(async (val) => {
            await UserModel.findOne({ email: val }).then(user => {
                if (user) {
                    return Promise.reject(new Error('Email already in use'))
                }
                return true;
            })
        }),
    check('password').notEmpty().withMessage('Password required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .custom((val, { req }) => {
            if (val !== req.body.passwordConfirm) {
                throw new Error('Password confirmation incorrect');
            }
            return true;
        }),
    check('passwordConfirm').notEmpty().withMessage('Password confirmation required'),
    check('role').notEmpty().withMessage('Role required')
        .isIn(['user', 'admin']).withMessage('Invalid role'),
    check('phone').optional().isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    check('profileImage').optional(),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMIddleware
]
exports.updateUserValidator = [
    param('id').isMongoId().withMessage('invalid User id format'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').notEmpty().withMessage('Email required')
        .isEmail().withMessage('Invalid email address')
        .custom(async (val) => {
            await UserModel.findOne({ email: val }).then(user => {
                if (user) {
                    return Promise.reject(new Error('Email already in use'))
                }
                return true;
            })
        }),
    check('role').notEmpty().withMessage('Role required')
        .isIn(['user', 'admin']).withMessage('Invalid role'),
    check('phone').optional().isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    validatorMIddleware
]

exports.changeUserPasswordValidator = [
    param('id').isMongoId().withMessage('invalid user id format'),

    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('passwordConfirm').notEmpty().withMessage('Password confirmation required'),
    body('password').notEmpty().withMessage('Password required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .custom(async (val, { req }) => {

            // check if current password is correct
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return Promise.reject(new Error('User not found'))
            }

            const isCorrect = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isCorrect) {
                return Promise.reject(new Error('Current password is incorrect'))
            }

            // verify password confirmation
            if (val !== req.body.passwordConfirm) {
                return Promise.reject(new Error('Password confirmation incorrect'))
            }
            return true;
        }),
    validatorMIddleware
]

exports.deleteUserValidator = [
    param('id').isMongoId().withMessage('invalid User id format'),
    validatorMIddleware
]