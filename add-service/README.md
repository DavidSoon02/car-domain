# Cart Add Service

Microservice for adding items to shopping cart.

## Features

- Add items to cart
- Update item quantities
- JWT authentication
- Redis storage

## Environment Variables

```
PORT=3001
REDIS_HOST=13.219.58.115
REDIS_PORT=6379
JWT_SECRET=distributed-programming-edison
NODE_ENV=development
```

## API Endpoints

### POST /api/cart/add
Add item to cart

**Headers:**
- Authorization: Bearer <jwt_token>

**Body:**
```json
{
  "productId": "123",
  "productName": "Product Name",
  "quantity": 2,
  "price": 29.99
}
```

**Response:**
```json
{
  "message": "Item added to cart successfully",
  "item": {
    "productId": "123",
    "productName": "Product Name",
    "quantity": 2,
    "price": 29.99
  }
}
```

### GET /health
Health check endpoint

## Installation

```bash
npm install
npm start
```

## Docker

```bash
docker build -t cart-add-service .
docker run -p 3001:3001 cart-add-service
```

## Usage Examples

### Example 1: Add new item to cart
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "productName": "Wireless Headphones",
    "quantity": 1,
    "price": 79.99
  }'
```

**Response:**
```json
{
  "message": "Item added to cart successfully",
  "item": {
    "productId": "prod_001",
    "productName": "Wireless Headphones",
    "quantity": 1,
    "price": 79.99
  }
}
```

### Example 2: Add more quantity to existing item
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "productName": "Wireless Headphones",
    "quantity": 2,
    "price": 79.99
  }'
```

**Response:**
```json
{
  "message": "Item added to cart successfully",
  "item": {
    "productId": "prod_001",
    "productName": "Wireless Headphones",
    "quantity": 3,
    "price": 79.99
  }
}
```

### Example 3: Add multiple different items
```bash
# Add smartphone
curl -X POST http://localhost:3001/api/cart/add \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_002",
    "productName": "Smartphone Case",
    "quantity": 1,
    "price": 24.99
  }'

# Add laptop
curl -X POST http://localhost:3001/api/cart/add \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_003",
    "productName": "Gaming Laptop",
    "quantity": 1,
    "price": 1299.99
  }'
```

### Error Examples

**Missing fields:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "quantity": 1
  }'
```

**Response:**
```json
{
  "error": "Missing required fields"
}
```

**Invalid token:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "productName": "Test Product",
    "quantity": 1,
    "price": 10.00
  }'
```

**Response:**
```json
{
  "error": "Invalid token"
}
```
