# Cart View Service

Microservice for viewing shopping cart contents.

## Features

- View entire cart with totals
- View specific cart items
- Calculate cart totals and item counts
- JWT authentication
- Redis storage

## Environment Variables

```
PORT=3003
REDIS_HOST=13.219.58.115
REDIS_PORT=6379
JWT_SECRET=distributed-programming-edison
NODE_ENV=development
```

## API Endpoints

### GET /api/cart/
Get entire cart with totals

**Headers:**
- Authorization: Bearer <jwt_token>

**Response:**
```json
{
  "message": "Cart retrieved successfully",
  "cart": {
    "items": [
      {
        "productId": "123",
        "productName": "Product Name",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "total": 59.98,
    "itemCount": 2
  }
}
```

### GET /api/cart/item/:productId
Get specific item from cart

**Headers:**
- Authorization: Bearer <jwt_token>

**Response:**
```json
{
  "message": "Item retrieved successfully",
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
docker build -t cart-view-service .
docker run -p 3003:3003 cart-view-service
```

## Usage Examples

### Example 1: Get entire cart with multiple items
```bash
curl -X GET http://localhost:3003/api/cart/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "message": "Cart retrieved successfully",
  "cart": {
    "items": [
      {
        "productId": "prod_001",
        "productName": "Wireless Headphones",
        "quantity": 2,
        "price": 79.99
      },
      {
        "productId": "prod_002",
        "productName": "Smartphone Case",
        "quantity": 1,
        "price": 24.99
      },
      {
        "productId": "prod_003",
        "productName": "Gaming Laptop",
        "quantity": 1,
        "price": 1299.99
      }
    ],
    "total": 1484.97,
    "itemCount": 4
  }
}
```

### Example 2: Get empty cart
```bash
curl -X GET http://localhost:3003/api/cart/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "message": "Cart retrieved successfully",
  "cart": {
    "items": [],
    "total": 0,
    "itemCount": 0
  }
}
```

### Example 3: Get specific item from cart
```bash
curl -X GET http://localhost:3003/api/cart/item/prod_001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "message": "Item retrieved successfully",
  "item": {
    "productId": "prod_001",
    "productName": "Wireless Headphones",
    "quantity": 2,
    "price": 79.99
  }
}
```

### Example 4: Get cart with single item
```bash
curl -X GET http://localhost:3003/api/cart/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "message": "Cart retrieved successfully",
  "cart": {
    "items": [
      {
        "productId": "prod_001",
        "productName": "Wireless Headphones",
        "quantity": 1,
        "price": 79.99
      }
    ],
    "total": 79.99,
    "itemCount": 1
  }
}
```

### Error Examples

**Item not found:**
```bash
curl -X GET http://localhost:3003/api/cart/item/non_existent_product \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "error": "Item not found in cart"
}
```

**Invalid token:**
```bash
curl -X GET http://localhost:3003/api/cart/ \
  -H "Authorization: Bearer invalid_token"
```

**Response:**
```json
{
  "error": "Invalid token"
}
```

**Missing token:**
```bash
curl -X GET http://localhost:3003/api/cart/
```

**Response:**
```json
{
  "error": "Access token required"
}
```
