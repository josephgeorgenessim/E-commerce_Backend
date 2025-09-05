const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConnection = require('./config/database');
const globalError = require('./middleware/errorMiddleware');
const ApiError = require('./utils/apiError');
const path = require('path');
const mountRoutes = require('./routes');
const cors = require('cors')
const compression = require('compression');
const { webhookCheckout } = require('./services/orderServices');
// Load environment variables
dotenv.config({ path: 'config.env' });

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors())
app.use(compression())

// webhooks
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout)

// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount Routes
mountRoutes(app);

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
