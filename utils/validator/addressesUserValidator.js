const { param, check, body } = require('express-validator');
const validatorMIddleware = require('../../middleware/validatorMiddleware');


exports.addAddressValidator = [
    check('alias').notEmpty().withMessage('Alias required'),
    check('details').notEmpty().withMessage('Details required'),
    check('phone').notEmpty().withMessage('Phone required'),
    check('city').notEmpty().withMessage('City required'),
    check('postalCode').notEmpty().withMessage('Postal code required'),
    validatorMIddleware
]

exports.removeAddressValidator = [
    param('addressId').notEmpty().withMessage('Address ID required'),
    validatorMIddleware
]
