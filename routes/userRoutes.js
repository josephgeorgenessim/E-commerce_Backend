const express = require('express');
const { getUsers, createUser, getUser, updateUser, deleteUser, uploadUserImage, resizeImage, changeUserPassword, } = require('../services/userServices');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator } = require('../utils/validator/userValidator');

const router = express.Router();

router.route('/changePassword/:id').put(changeUserPasswordValidator, changeUserPassword)
// router.use('/:categoryId/subcategories', subCategoryRoute)
router.route('/').get(getUsers).post(uploadUserImage, resizeImage, createUserValidator, createUser);
router.route('/:id')
    .get(getUserValidator, getUser)
    .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

module.exports = router;