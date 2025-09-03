const categoryRoute = require('./categoryRoutes');
const subCategoryRoute = require('./subCategoryRoutes');
const brandsRoute = require('./brandRoutes');
const productsRoute = require('./productsRoutes.js');
const userRoute = require('./userRoutes.js');
const authRoute = require('./authRoutes.js');
const reviewRoute = require('./reviewRoutes.js');
const wishlistRoute = require('./wishlistRoutes.js');
const addressesUserRoute = require('./addressesUserRoutes.js');
const couponRoute = require('./couponRoutes.js');

const mountRoutes = (app) => {
    // Mounting Routes
    app.use('/api/v1/categories', categoryRoute);
    app.use('/api/v1/subcategories', subCategoryRoute);
    app.use('/api/v1/brands', brandsRoute);
    app.use('/api/v1/products', productsRoute);
    app.use('/api/v1/users', userRoute);
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/reviews', reviewRoute);
    app.use('/api/v1/wishlist', wishlistRoute);
    app.use('/api/v1/addresses', addressesUserRoute);
    app.use('/api/v1/coupons', couponRoute);

}

module.exports = mountRoutes
