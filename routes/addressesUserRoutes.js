const express = require('express');
const { protect, allowedTo } = require('../services/authServices');
const { getUserAddresses, addAddress, removeAddress } = require('../services/addressesUserServices');
const { addAddressValidator, removeAddressValidator } = require('../utils/validator/addressesUserValidator');

const router = express.Router();

router.route('/').get(protect, allowedTo('user'), getUserAddresses).post(protect, allowedTo('user'), addAddressValidator, addAddress)
router.route('/:addressId').delete(protect, allowedTo('user'), removeAddressValidator, removeAddress)

module.exports = router;
