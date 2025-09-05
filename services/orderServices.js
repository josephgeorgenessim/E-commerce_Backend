
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');
const OrderModel = require('../models/orderModel');
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');
const factory = require('./handlerFactory');
const Stripe = require('stripe')(`sk_test_51S430APUagKYlCuaykJa7eXzED8zVlavXlNIR1yMv70Xy6QS7jp4fZuvaLnArk3J5DVmkdWD4WTyfVoMlbVrWrUJ003WeeoZmo`);




// @desc    Create new order
// @route   POST /api/v1/orders/cartId
// @access  protected / user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice = 0
    const shippingPrice = 0
    // 1) get card id from req.params

    const { cartId } = req.params;

    const userCart = await CartModel.findOne({ _id: cartId })
    if (!userCart) {
        return next(new ApiError('Cart not found', 404))
    }

    // 2) get order price depand on cart price -> check if here coupon apply 
    const orderPrice = userCart.totalPriceAfterDiscount || userCart.totalCartPrice
    const totalOrderPrice = orderPrice + taxPrice + shippingPrice

    // 3) create order with a default payment method cash
    const order = await OrderModel.create({
        user: req.user._id,
        CartItems: userCart.CartItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress,
    })
    if (!order) {
        return next(new ApiError('Order not created', 404))
    }

    // 4) after create order , decrement product quantity, increment order sold 
    if (order) {
        const bulkOptions = userCart.CartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: {
                    $inc: {
                        quantity: -item.quantity,
                        sold: +item.quantity
                    }
                }
            }
        }))
        await ProductModel.bulkWrite(bulkOptions)

        // 5) clear user cart
        await CartModel.findByIdAndDelete(cartId)
    } else {
        return next(new ApiError('Cart is empty', 404))
    }
    res.status(200).json({
        status: 'success',
        message: 'Order created successfully',
        order: order
    })
})



// tiken expire middleware
exports.filterOrderByLogin = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'user') {
        req.filterObj = { user: req.user._id }
    }
    next()
})

// @desc    get all orders
// @route   GET /api/v1/orders
// @access  protected / user - admin
exports.findAllOrders = factory.getAll(OrderModel, "Orders")


// @desc    get user orders
// @route   GET /api/v1/orders/user
// @access  protected / user
exports.findSpecificOrder = factory.getOne(OrderModel, "Orders")


// @desc    update order status is paid 
// @route   PUT /api/v1/orders/:id/paid
// @access  protected / admin
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
        return next(new ApiError('Order not found', 404))
    }

    order.isPaid = true
    order.paidAt = Date.now()

    const updateOrder = await order.save()

    res.status(200).json({
        status: 'success',
        message: 'Order updated successfully',
        order: updateOrder
    })
})


// @desc    update order status is delivered 
// @route   PUT /api/v1/orders/:id/delivered
// @access  protected / admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
        return next(new ApiError('Order not found', 404))
    }

    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updateOrder = await order.save()

    res.status(200).json({
        status: 'success',
        message: 'Order updated successfully',
        order: updateOrder
    })
})


// @desc    create order with stripe
// @route   GET /api/v1/orders/checkout-session/:cartId
// @access  protected / user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
    const taxPrice = 0
    const shippingPrice = 0

    // 1) get card id from req.params

    const { cartId } = req.params;

    const userCart = await CartModel.findOne({ _id: cartId })
    if (!userCart) {
        return next(new ApiError('Cart not found', 404))
    }
    // 2) get order price depand on cart price -> check if here coupon apply 
    const orderPrice = userCart.totalPriceAfterDiscount || userCart.totalCartPrice
    const totalOrderPrice = orderPrice + taxPrice + shippingPrice

    // 3) create stripe checkout session 
    const session = await Stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: req.user.name,
                    },
                    unit_amount: totalOrderPrice * 100,
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: cartId,
        // metadata: req.body.shippingAddress,
    })

    // 4) send session to response 
    res.status(200).json({
        status: 'success',
        session
    })
})


const createCardOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const orderPrice = session.amount_total / 100;

    const userCart = await CartModel.findOne({ _id: cartId })
    const user = await User.findById({ email: session.customer_email })

    const order = await OrderModel.create({
        user: user._id,
        CartItems: userCart.CartItems,
        totalOrderPrice: orderPrice,
        shippingAddress: shippingAddress,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethod: 'card',
    })

    if (order) {
        const bulkOptions = userCart.CartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: {
                    $inc: {
                        quantity: -item.quantity,
                        sold: +item.quantity
                    }
                }
            }
        }))
        await ProductModel.bulkWrite(bulkOptions)

        await CartModel.findByIdAndDelete(cartId)
    } else {
        return next(new ApiError('Cart is empty', 404))
    }

}

// @desc    this webhook is responsible about stripe payment
// @route   POST /api/v1/webhook-checkout
// @access  protected / user
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = await Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return next(new ApiError('Invalid webhook signature', 400))
    }
    if (event.type === 'checkout.session.completed') {
        createCardOrder(event.data.object)
    }

    res.status(200).json({
        status: 'success',
        message: 'Webhook processed successfully'
    })
})