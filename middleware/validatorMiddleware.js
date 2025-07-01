const { validationResult } = require('express-validator');

const validatorMIddleware = (req, res, next) => {
    // catch errors from rules if exist
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

module.exports = validatorMIddleware;