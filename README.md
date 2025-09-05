# E-commerce Backend API

A robust, scalable backend API for an e-commerce platform built with Node.js, Express, and MongoDB. This project provides a complete set of RESTful APIs to power an e-commerce application with features like user authentication, product management, shopping cart, order processing, and payment integration.

## 🚀 Features

- **User Authentication & Authorization**
  - User registration and login with JWT
  - Password reset via email
  - Role-based access control (User, Admin)

- **Product Management**
  - CRUD operations for products
  - Product categorization with categories and subcategories
  - Product reviews and ratings
  - Image upload with processing

- **Shopping Experience**
  - Shopping cart functionality
  - Wishlist management
  - Coupon/discount system
  - Order processing and tracking

- **Payment Integration**
  - Stripe payment processing
  - Webhook support for payment confirmation

- **Security**
  - Data sanitization
  - Rate limiting
  - HTTP security headers
  - XSS protection

## 🛠️ Technologies Used

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with Sharp for image processing
- **Payment Processing**: Stripe
- **Email**: Nodemailer
- **Security**: Helmet, Express Rate Limit, Express Mango Sanitize
- **Development Tools**: Nodemon, ESLint, Prettier
- **API Documentation**: (Consider adding Swagger/OpenAPI)

## 📦 Dependencies

### Core Dependencies
- express: ^5.1.0
- mongoose: ^8.16.1
- jsonwebtoken: ^9.0.2
- bcrypt: ^6.0.0
- stripe: ^18.5.0
- multer: ^2.0.2
- sharp: ^0.34.3
- nodemailer: ^7.0.5

### Development Dependencies
- nodemon: ^3.1.10
- eslint: ^8.57.1
- prettier: ^3.6.2
- cross-env: ^7.0.3

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account (for payment processing)
- SMTP service (for email functionality)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd E-commerce_Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   PORT=5000
   DB_URL=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES=90
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

## 🏗️ Project Structure

```
E-commerce_Backend/
├── config/               # Configuration files
├── controllers/          # Route controllers
├── middleware/           # Custom middleware
│   ├── errorMiddleware.js
│   ├── uploadImageMiddleware.js
│   └── validatorMiddleware.js
├── models/              # Database models
│   ├── userModel.js
│   ├── productModel.js
│   ├── categoryModel.js
│   ├── orderModel.js
│   ├── cartModel.js
│   └── ...
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── ...
├── services/            # Business logic
├── uploads/             # Uploaded files
├── utils/               # Utility functions
├── .env                 # Environment variables
├── .eslintrc.json       # ESLint config
├── package.json
└── server.js            # Application entry point
```

## 📚 API Documentation

For detailed API documentation, please refer to the [API Documentation](API_DOCS.md).

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Rate limiting is implemented to prevent brute force attacks
- Input validation and sanitization
- Helmet for setting secure HTTP headers

## 🧪 Testing

To run tests:
```bash
# Coming soon
# npm test
```

## 🚀 Deployment

To deploy to production:
```bash
npm run start:prod
```
