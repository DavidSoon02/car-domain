# Cart Domain Microservices

Distributed shopping cart system built with Node.js, Redis, and JWT authentication.

## Architecture

This project consists of three independent microservices:

- **add-service** (Port 3001) - Add items to cart
- **remove-service** (Port 3002) - Remove items from cart  
- **view-service** (Port 3003) - View cart contents

## Prerequisites

- Node.js 18+
- Redis server running on 13.219.58.115:6379
- JWT tokens for authentication

## Environment Setup

Each service requires its own `.env` file:

```env
PORT=300X
REDIS_HOST=13.219.58.115
REDIS_PORT=6379
JWT_SECRET=distributed-programming-edison
NODE_ENV=development
```

## Authentication

All endpoints require JWT authentication:
```
Authorization: Bearer <your_jwt_token>
```

Token should contain user ID in payload for cart identification.

## Quick Start

### Install dependencies for all services:
```bash
cd add-service && npm install
cd ../remove-service && npm install  
cd ../view-service && npm install
```

### Start all services:
```bash
# Terminal 1
cd add-service && npm start

# Terminal 2  
cd remove-service && npm start

# Terminal 3
cd view-service && npm start
```

### Using Docker:
```bash
# Build each service
docker build -t cart-add-service ./add-service
docker build -t cart-remove-service ./remove-service
docker build -t cart-view-service ./view-service

# Run each service
docker run -p 3001:3001 cart-add-service
docker run -p 3002:3002 cart-remove-service
docker run -p 3003:3003 cart-view-service
```

## API Usage Examples

### Complete Cart Workflow Example

#### 1. Add items to cart:
```bash
# Add wireless headphones
curl -X POST http://localhost:3001/api/cart/add \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "productName": "Wireless Headphones",
    "quantity": 2,
    "price": 79.99
  }'

# Add smartphone case
curl -X POST http://localhost:3001/api/cart/add \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_002",
    "productName": "Smartphone Case",
    "quantity": 1,
    "price": 24.99
  }'

# Add gaming laptop
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

#### 2. View cart contents:
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

#### 3. Remove some quantity:
```bash
# Remove 1 headphone (keeping 1)
curl -X DELETE http://localhost:3002/api/cart/remove \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "quantity": 1
  }'
```

#### 4. View specific item:
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
    "quantity": 1,
    "price": 79.99
  }
}
```

#### 5. Remove item completely:
```bash
curl -X DELETE http://localhost:3002/api/cart/remove \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_002"
  }'
```

#### 6. View updated cart:
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
      },
      {
        "productId": "prod_003",
        "productName": "Gaming Laptop",
        "quantity": 1,
        "price": 1299.99
      }
    ],
    "total": 1379.98,
    "itemCount": 2
  }
}
```

#### 7. Clear entire cart:
```bash
curl -X DELETE http://localhost:3002/api/cart/clear \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 8. Verify empty cart:
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

### Error Handling Examples

#### Authentication Errors:
```bash
# Missing token
curl -X GET http://localhost:3003/api/cart/
# Response: {"error": "Access token required"}

# Invalid token
curl -X GET http://localhost:3003/api/cart/ \
  -H "Authorization: Bearer invalid_token"
# Response: {"error": "Invalid token"}
```

#### Validation Errors:
```bash
# Missing required fields
curl -X POST http://localhost:3001/api/cart/add \
  -H "Authorization: Bearer valid_token" \
  -H "Content-Type: application/json" \
  -d '{"productId": "prod_001"}'
# Response: {"error": "Missing required fields"}

# Item not found
curl -X DELETE http://localhost:3002/api/cart/remove \
  -H "Authorization: Bearer valid_token" \
  -H "Content-Type: application/json" \
  -d '{"productId": "non_existent"}'
# Response: {"error": "Item not found in cart"}
```

## Health Checks

Each service provides a health endpoint:
- http://localhost:3001/health
- http://localhost:3002/health  
- http://localhost:3003/health

## Data Structure

Cart data is stored in Redis with the following structure:
```
Key: cart:{userId}
Value: Hash map of {productId: itemData}
```

Item data format:
```json
{
  "productId": "123",
  "productName": "Product Name",
  "quantity": 2,
  "price": 29.99
}
```
