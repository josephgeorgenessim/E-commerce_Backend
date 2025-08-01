const { param, check, body } = require('express-validator');
const validatorMIddleware = require('../../middleware/validatorMiddleware');
const { default: slugify } = require('slugify');
const UserModel = require('../../models/userModel');
const ApiError = require('../apiError');
const bcrypt = require('bcrypt')


exports.signUpValidator = [
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

    validatorMIddleware
]

