# E-commerce API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Products](#products)
4. [Categories](#categories)
5. [Subcategories](#subcategories)
6. [Brands](#brands)
7. [Carts](#carts)
8. [Orders](#orders)
9. [Coupons](#coupons)
10. [Reviews](#reviews)
11. [Wishlists](#wishlists)
12. [User Addresses](#user-addresses)

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

### Register a New User
```http
POST /api/v1/auth/signup
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "phone": "+201234567890"
}
```

### Login
```http
POST /api/v1/auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Forgot Password
```http
POST /api/v1/auth/forgetPassword
```
**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Verify Reset Code
```http
POST /api/v1/auth/verifyResetCode
```
**Request Body:**
```json
{
  "resetCode": "123456"
}
```

### Reset Password
```http
POST /api/v1/auth/resetPassword
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "newPassword": "newpassword123"
}
```

## Orders

### Create Cash Order
```http
POST /api/v1/orders/:cartId
```
**Headers:**
```
Authorization: Bearer <token>
```

### Get Checkout Session
```http
GET /api/v1/orders/checkout-session/:cartId
```
**Headers:**
```
Authorization: Bearer <token>
```

### Get All Orders (Admin/User)
```http
GET /api/v1/orders
```
**Headers:**
```
Authorization: Bearer <token>
```

### Get Specific Order
```http
GET /api/v1/orders/:id
```

### Update Order to Paid (Admin)
```http
PUT /api/v1/orders/:id/paid
```
**Headers:**
```
Authorization: Bearer <admin_token>
```

### Update Order to Delivered (Admin)
```http
PUT /api/v1/orders/:id/delivered
```
**Headers:**
```
Authorization: Bearer <admin_token>
```

## Carts

### Get User Cart
```http
GET /api/v1/cart
```
**Headers:**
```
Authorization: Bearer <token>
```

### Add Product to Cart
```http
POST /api/v1/cart
```
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
  "productId": "product_id_here",
  "color": "red",
  "quantity": 2
}
```

### Update Cart Item Quantity
```http
PUT /api/v1/cart/:itemId
```
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
  "quantity": 3
}
```

### Remove Item from Cart
```http
DELETE /api/v1/cart/:itemId
```
**Headers:**
```
Authorization: Bearer <token>
```

### Apply Coupon to Cart
```http
PUT /api/v1/cart/applyCoupon
```
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
  "coupon": "SUMMER20"
}
```

## Products

### Get All Products
```http
GET /api/v1/products
```
**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort by field (e.g., `price` or `-price` for descending)
- `keyword` - Search keyword
- `category` - Filter by category ID
- `brand` - Filter by brand ID
- `price[gte]` - Minimum price
- `price[lte]` - Maximum price

### Get Single Product
```http
GET /api/v1/products/:id
```

### Create Product (Admin)
```http
POST /api/v1/products
```
**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```
**Form Data:**
- `title` - Product title
- `description` - Product description
- `quantity` - Available quantity
- `sold` - Number of items sold (default: 0)
- `price` - Product price
- `priceAfterDiscount` - Price after discount
- `colors` - Array of colors (JSON string)
- `images` - Array of images (files)
- `category` - Category ID
- `subcategories` - Array of subcategory IDs (JSON string)
- `brand` - Brand ID

### Update Product (Admin)
```http
PUT /api/v1/products/:id
```
**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

### Delete Product (Admin)
```http
DELETE /api/v1/products/:id
```
**Headers:**
```
Authorization: Bearer <admin_token>
```

## Categories

### Get All Categories
```http
GET /api/v1/categories
```

### Get Single Category
```http
GET /api/v1/categories/:id
```

### Create Category (Admin)
```http
POST /api/v1/categories
```
**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```
**Form Data:**
- `name` - Category name
- `image` - Category image

## Wishlist

### Get User Wishlist
```http
GET /api/v1/wishlist
```
**Headers:**
```
Authorization: Bearer <token>
```

### Add Product to Wishlist
```http
POST /api/v1/wishlist
```
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
  "productId": "product_id_here"
}
```

### Remove Product from Wishlist
```http
DELETE /api/v1/wishlist/:productId
```
**Headers:**
```
Authorization: Bearer <token>
```

## User Addresses

### Get User Addresses
```http
GET /api/v1/addresses
```
**Headers:**
```
Authorization: Bearer <token>
```

### Add New Address
```http
POST /api/v1/addresses
```
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
  "alias": "Home",
  "details": "123 Main St",
  "phone": "+201234567890",
  "city": "Cairo",
  "postalCode": "12345"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Error message here"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Please login first"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "You are not allowed to perform this action"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

## Rate Limiting
- 100 requests per 15 minutes per IP address

## Response Format
All API responses follow this format:
```json
{
  "status": "success" | "error" | "fail",
  "results": 1,
  "pagination": {},
  "data": {}
}
```
