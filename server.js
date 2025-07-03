const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoutes');
const subCategoryRoute = require('./routes/subCategoryRoutes');
const brandsRoute = require('./routes/brandRoutes');
const globalError = require('./middleware/errorMiddleware');
const ApiError = require('./utils/apiError');

// Load environment variables
dotenv.config({ path: 'config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());


// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mounting Routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brandsRoute);

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
