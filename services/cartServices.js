const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Products = require('../models/productModel');


// calculate total cart price
const calculateTotalCartPrice = (cart) => {
    let totalCartPrice = 0;
    cart.CartItems.forEach(item => {
        totalCartPrice += item.price * item.quantity
    })
    return totalCartPrice
}

// @desc    Get user cart
// @route   GET /api/v1/cart
// @access  protected / user
exports.getUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('CartItems.product')
    if (!cart) {
        return next(new ApiError('Cart not found', 404))
    }
    res.status(200).json({
        status: 'success',
        totalItems: cart.CartItems.length,
        cart: cart
    })
})


// @desc    Add product to user cart
// @route   POST /api/v1/cart
// @access  protected / user
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;
    const product = await Products.findById(productId);
    const userCart = await Cart.findOne({ user: req.user._id });

    // if product not found
    if (!product) {
        return next(new ApiError('Product not found', 404))
    }

    // if user has no cart create one
    if (!userCart) {
        const cart = await Cart.create({
            user: req.user._id,
            CartItems: [
                {
                    product: productId,
                    color: color,
                    price: product.price
                }
            ]
        })
        return res.status(200).json({
            status: 'success',
            cart: cart
        })
    }

    // if product already in cart increase quantity
    const productInCart = userCart.CartItems.findIndex(item => item.product.toString() === productId && item.color === color)
    console.log(productInCart)
    if (productInCart > -1) {
        const cartItem = userCart.CartItems[productInCart]
        cartItem.quantity++
        userCart.CartItems[productInCart] = cartItem

    } else {
        // if product not in cart add it
        userCart.CartItems.push({
            product: productId,
            color: color,
            price: product.price,
            quantity: 1
        })
    }

    // calculate total cart price
    const totalCartPrice = calculateTotalCartPrice(userCart)
    userCart.totalCartPrice = totalCartPrice
    userCart.totalPriceAfterDiscount = null
    await userCart.save()
    return res.status(200).json({
        status: 'success',
        cart: userCart
    })
})


// @desc    Remove product from user cart
// @route   DELETE /api/v1/cart/:itemId
// @access  protected / user
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
    const { itemId } = req.params;

    const userCart = await Cart.findOneAndUpdate({ user: req.user._id },
        { $pull: { CartItems: { _id: itemId } } }, { new: true });

    if (!userCart) {
        return next(new ApiError('Cart not found', 404))
    }

    const totalCartPrice = calculateTotalCartPrice(userCart)
    userCart.totalCartPrice = totalCartPrice

    await userCart.save()
    return res.status(200).json({
        status: 'success',
        cart: userCart
    })
})


// @desc    Update product quantity in user cart
// @route   PUT /api/v1/cart/:itemId
// @access  protected / user
exports.updateProductQuantityInCart = asyncHandler(async (req, res, next) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const userCart = await Cart.findOne({ user: req.user._id });
    const productInCart = userCart.CartItems.findIndex(item => item._id.toString() === itemId)

    if (productInCart > -1) {
        const cartItem = userCart.CartItems[productInCart]
        cartItem.quantity = quantity
        userCart.CartItems[productInCart] = cartItem
        console.log("here in index", cartItem)
        console.log("here in userCart", userCart)
    } else {
        return next(new ApiError('Product not found in cart', 404))
    }
    if (!userCart) {
        return next(new ApiError('Cart not found', 404))
    }
    const totalCartPrice = calculateTotalCartPrice(userCart)
    userCart.totalCartPrice = totalCartPrice

    await userCart.save()
    return res.status(200).json({
        status: 'success',
        cart: userCart
    })
})


// @desc    Clear user cart
// @route   DELETE /api/v1/cart/clear
// @access  protected / user
exports.clearCart = asyncHandler(async (req, res, next) => {
    const userCart = await Cart.findOneAndDelete({ user: req.user._id });
    if (!userCart) {
        return next(new ApiError('Cart not found', 404))
    }
    return res.status(200).json({
        status: 'success',
        message: 'Cart cleared successfully'
    })
})


// @desc    Apply coupon to user cart
// @route   POST /api/v1/cart/coupon
// @access  protected / user
exports.applyCouponToCart = asyncHandler(async (req, res, next) => {
    const { coupon } = req.body;
    const userCart = await Cart.findOne({ user: req.user._id });
    const couponIsHere = await Coupon.findOne({ name: coupon, expiryDate: { $gte: new Date() } });

    if (!couponIsHere) {
        return next(new ApiError('Coupon is invalid or expired', 404))
    }

    if (!userCart) {
        return next(new ApiError('Cart not found', 404))
    }
    console.log(userCart)
    const totalCartPrice = userCart.totalCartPrice
    console.log(totalCartPrice)
    console.log(couponIsHere.discount)
    const totalPriceAfterDiscount = (totalCartPrice - (totalCartPrice * couponIsHere.discount) / 100).toFixed(2)
    console.log(totalPriceAfterDiscount)
    userCart.totalPriceAfterDiscount = totalPriceAfterDiscount

    await userCart.save()
    return res.status(200).json({
        status: 'success',
        message: 'Coupon applied successfully',
        discount: couponIsHere.discount,
        totalCartItems: userCart.CartItems.length,
        cart: userCart
    })
})