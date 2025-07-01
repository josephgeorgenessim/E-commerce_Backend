const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoutes');
const apiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config({ path: 'config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// DB connection
dbConnection();

// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mounting Routes
app.use('/api/v1/categories', categoryRoute);

// Handle undefined routes
app.use((req, res, next) => {
    next(new apiError(`Can't find this route: ${req.originalUrl}`, 400))
});

// Global error handler for express
app.use(globalError);

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle errors outside express
process.on("unhandledRejection", (err) => {
    console.log(`unhandledRejection Errors: ${err}`)
    server.close(() => {
        console.log(`shutdown server`)
        process.exit(1)
    })
})