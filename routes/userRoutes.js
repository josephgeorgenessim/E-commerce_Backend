const express = require('express');
const { getUsers, createUser, getUser, updateUser, deleteUser, uploadUserImage, resizeImage, changeUserPassword, } = require('../services/userServices');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator } = require('../utils/validator/userValidator');

const { protect, allowedTo } = require('../services/authServices')

const router = express.Router();

router.route('/changePassword/:id').put(changeUserPasswordValidator, changeUserPassword)
// router.use('/:categoryId/subcategories', subCategoryRoute)
router.route('/').get(protect, allowedTo('admin'), getUsers).post(protect, allowedTo('admin'), uploadUserImage, resizeImage, createUserValidator, createUser);
router.route('/:id')
    .get(protect, allowedTo('admin'), getUserValidator, getUser)
    .put(protect, allowedTo('admin'), uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(protect, allowedTo('admin'), deleteUserValidator, deleteUser);

module.exports = router;