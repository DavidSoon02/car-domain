# Cart Remove Service

Microservice for removing items from shopping cart.

## Features

- Remove items from cart
- Clear entire cart
- Partial quantity removal
- JWT authentication
- Redis storage

## Environment Variables

```
PORT=3002
REDIS_HOST=13.219.58.115
REDIS_PORT=6379
JWT_SECRET=distributed-programming-edison
NODE_ENV=development
```

## API Endpoints

### DELETE /api/cart/remove
Remove item from cart

**Headers:**
- Authorization: Bearer <jwt_token>

**Body:**
```json
{
  "productId": "123",
  "quantity": 1
}
```

**Response:**
```json
{
  "message": "Item processed successfully",
  "result": {
    "productId": "123",
    "productName": "Product Name",
    "quantity": 1,
    "price": 29.99
  }
}
```

### DELETE /api/cart/clear
Clear entire cart

**Headers:**
- Authorization: Bearer <jwt_token>

**Response:**
```json
{
  "message": "Cart cleared successfully"
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
docker build -t cart-remove-service .
docker run -p 3002:3002 cart-remove-service
```

## Usage Examples

### Example 1: Remove specific quantity from cart
```bash
curl -X DELETE http://localhost:3002/api/cart/remove \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "quantity": 1
  }'
```

**Response (item still in cart with reduced quantity):**
```json
{
  "message": "Item processed successfully",
  "result": {
    "productId": "prod_001",
    "productName": "Wireless Headphones",
    "quantity": 2,
    "price": 79.99
  }
}
```

### Example 2: Remove item completely (no quantity specified)
```bash
curl -X DELETE http://localhost:3002/api/cart/remove \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_002"
  }'
```

**Response:**
```json
{
  "message": "Item processed successfully",
  "result": {
    "message": "Item removed completely from cart"
  }
}
```

### Example 3: Remove more quantity than available
```bash
curl -X DELETE http://localhost:3002/api/cart/remove \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "quantity": 10
  }'
```

**Response (item removed completely):**
```json
{
  "message": "Item processed successfully",
  "result": {
    "message": "Item removed completely from cart"
  }
}
```

### Example 4: Clear entire cart
```bash
curl -X DELETE http://localhost:3002/api/cart/clear \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "message": "Cart cleared successfully"
}
```

### Error Examples

**Item not found:**
```bash
curl -X DELETE http://localhost:3002/api/cart/remove \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "non_existent_product"
  }'
```

**Response:**
```json
{
  "error": "Item not found in cart"
}
```

**Missing product ID:**
```bash
curl -X DELETE http://localhost:3002/api/cart/remove \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 1
  }'
```

**Response:**
```json
{
  "error": "Product ID is required"
}
```
