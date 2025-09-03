const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoutes');
const subCategoryRoute = require('./routes/subCategoryRoutes');
const brandsRoute = require('./routes/brandRoutes');
const productsRoute = require('./routes/productsRoutes.js');
const userRoute = require('./routes/userRoutes.js');
const authRoute = require('./routes/authRoutes.js');
const reviewRoute = require('./routes/reviewRoutes.js');
const wishlistRoute = require('./routes/wishlistRoutes.js');
const addressesUserRoute = require('./routes/addressesUserRoutes.js');
const globalError = require('./middleware/errorMiddleware');
const ApiError = require('./utils/apiError');
const path = require('path');

// Load environment variables
dotenv.config({ path: 'config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));


// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

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
// Handle undefined routes
app.use((req, res, next) => {
    next(new ApiError(`can't find this route: ${req.originalUrl}`, 400))
});

// Global error handler for express
app.use(globalError);

// Start server
const startServer = async () => {
    try {
        await dbConnection();
        console.log('✅ Database connected');

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        // Handle unhandled promise rejections
        process.on("unhandledRejection", (err) => {
            console.error(`❌ Unhandled Rejection: ${err.message}`);
            server.close(() => {
                console.log(`🛑 Server shut down`);
                process.exit(1);
            });
        });

    } catch (err) {
        console.error('❌ Failed to connect to DB:', err);
        process.exit(1);
    }
};

startServer();
