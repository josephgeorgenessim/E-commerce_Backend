const express = require('express');
const { signUp } = require('../services/authServices');
const { signUpValidator } = require('../utils/validator/authValidator');

const router = express.Router();

router.route('/signup').post(signUpValidator, signUp)


module.exports = router;