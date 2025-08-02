const express = require('express');
const { signUp, login, forgetPassword, verifyResetCode, resetPassword } = require('../services/authServices');
const { signUpValidator, loginValidator } = require('../utils/validator/authValidator');

const router = express.Router();

router.route('/signup').post(signUpValidator, signUp)
router.route('/login').post(loginValidator, login)
router.route('/forgetPassword').post(forgetPassword)
router.route('/verifyResetCode').post(verifyResetCode)
router.route('/resetPassword').post(resetPassword)
module.exports = router;