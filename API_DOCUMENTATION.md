# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes need JWT token:
```
Authorization: Bearer <token>
```

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Create new user | No |
| POST | `/auth/login` | Login and get token | No |
| GET | `/auth/me` | Get current user | Yes |

## SKU Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/sku` | List all SKUs | Yes |
| POST | `/sku` | Create new SKU | Yes (Admin) |
| GET | `/sku/:id` | Get single SKU | Yes |
| PUT | `/sku/:id` | Update SKU | Yes (Admin) |
| DELETE | `/sku/:id` | Delete SKU | Yes (Admin) |

## Stock Movements

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stock-movements` | List all movements | Yes |
| POST | `/stock-movements` | Create movement (IN/OUT/ADJUST) | Yes |
| GET | `/stock-movements/:id` | Get movement details | Yes |

## Analytics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/analytics/dashboard` | Dashboard stats | Yes |
| GET | `/analytics/aging` | Stock aging report | Yes |
| GET | `/analytics/turnover` | Turnover analysis | Yes |
| GET | `/analytics/trends` | Historical trends | Yes |

## Audit Logs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/audit-logs` | View audit trail | Yes (Admin) |

## Example Requests

### Register
```bash
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

### Create SKU
```bash
POST /sku
{
  "name": "Cement Bags",
  "sku_code": "CEM-001",
  "category": "Materials",
  "unit": "bags",
  "quantity": 500,
  "reorder_level": 100,
  "location": "Warehouse A"
}
```

### Stock Movement
```bash
POST /stock-movements
{
  "sku_id": "507f1f77bcf86cd799439011",
  "type": "IN",
  "quantity": 100,
  "reason": "Purchase order #1234"
}
```

## Error Responses

All errors return:
```json
{
  "message": "Error description"
}
```

HTTP status codes:
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error


**Request Body:**
```json
{
  "email": "admin@insyd.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rahul Sharma",
    "email": "admin@insyd.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile

**GET** `/auth/profile`

Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rahul Sharma",
    "email": "admin@insyd.com",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 📦 SKU Management

### Get All SKUs

**GET** `/skus`

Retrieve paginated list of SKUs with optional filters.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `category` (optional): Filter by category (tiles, sanitaryware, lighting, stone, plywood)
- `search` (optional): Search in SKU code, name, supplier
- `lowStock` (optional): `true` to show only low stock items
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `sortBy` (optional): Field to sort by (default: createdAt)
- `sortOrder` (optional): asc or desc (default: desc)

**Example Request:**
```
GET /api/skus?category=tiles&search=vitrified&page=1&limit=20
```

**Response:**
```json
{
  "skus": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "skuCode": "TILE-VIT-001",
      "name": "Vitrified Floor Tiles 600x600mm Glossy White",
      "category": "tiles",
      "subcategory": "vitrified",
      "description": "Premium glossy white vitrified tiles",
      "supplier": "Kajaria Ceramics",
      "costPrice": 45,
      "sellingPrice": 65,
      "currentStock": 500,
      "unit": "pieces",
      "minReorderQuantity": 100,
      "maxStockLevel": 800,
      "location": "warehouse",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 8
  }
}
```

### Get SKU by ID

**GET** `/skus/:id`

Get detailed SKU information including recent stock movements.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "sku": {
    "_id": "507f1f77bcf86cd799439011",
    "skuCode": "TILE-VIT-001",
    "name": "Vitrified Floor Tiles 600x600mm Glossy White",
    // ... full SKU details
  },
  "recentMovements": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "movementType": "outward",
      "quantity": 50,
      "newStock": 500,
      "performedByName": "Priya Patel",
      "createdAt": "2024-01-15T14:20:00.000Z"
    }
  ]
}
```

### Create SKU

**POST** `/skus`

Create a new SKU (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "skuCode": "TILE-VIT-003",
  "name": "Vitrified Floor Tiles 600x600mm Matte Black",
  "category": "tiles",
  "subcategory": "vitrified",
  "description": "Modern matte black tiles",
  "supplier": "Kajaria Ceramics",
  "costPrice": 50,
  "sellingPrice": 75,
  "currentStock": 0,
  "unit": "pieces",
  "minReorderQuantity": 100,
  "maxStockLevel": 800,
  "location": "warehouse",
  "attributes": {
    "size": "600x600mm",
    "finish": "matte",
    "color": "black"
  }
}
```

**Response:**
```json
{
  "message": "SKU created successfully",
  "sku": {
    "_id": "507f1f77bcf86cd799439013",
    "skuCode": "TILE-VIT-003",
    // ... full SKU details
  }
}
```

### Update SKU

**PUT** `/skus/:id`

Update SKU details (Admin only). Cannot update stock directly - use stock movements.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "sellingPrice": 80,
  "minReorderQuantity": 120,
  "maxStockLevel": 900
}
```

**Response:**
```json
{
  "message": "SKU updated successfully",
  "sku": {
    "_id": "507f1f77bcf86cd799439011",
    // ... updated SKU details
  }
}
```

### Delete SKU

**DELETE** `/skus/:id`

Soft delete SKU by marking as inactive (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "SKU deleted successfully"
}
```

### Get SKU Statistics

**GET** `/skus/stats`

Get aggregate statistics about SKUs.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "totalSKUs": 150,
  "activeSKUs": 145,
  "lowStockSKUs": 12,
  "totalStockValue": 5250000,
  "categoryBreakdown": [
    {
      "_id": "tiles",
      "count": 50,
      "totalValue": 2000000
    },
    {
      "_id": "sanitaryware",
      "count": 30,
      "totalValue": 1500000
    }
  ]
}
```

---

## 📊 Stock Movements

### Record Stock Movement

**POST** `/stock-movements`

Record a stock movement (inward, outward, damage, loss, adjustment, transfer).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "skuId": "507f1f77bcf86cd799439011",
  "movementType": "outward",
  "quantity": 50,
  "reason": "Customer order #1234",
  "referenceNumber": "INV-2024-001",
  "fromLocation": "warehouse",
  "toLocation": "customer",
  "notes": "Delivered to project site"
}
```

**Movement Types:**
- `inward`: Stock received from supplier
- `outward`: Stock sold to customer
- `damage`: Damaged goods
- `loss`: Lost/stolen goods
- `adjustment`: Manual stock correction
- `transfer`: Transfer between locations

**Response:**
```json
{
  "message": "Stock movement recorded successfully",
  "movement": {
    "_id": "507f1f77bcf86cd799439014",
    "sku": "507f1f77bcf86cd799439011",
    "skuCode": "TILE-VIT-001",
    "skuName": "Vitrified Floor Tiles 600x600mm Glossy White",
    "movementType": "outward",
    "quantity": 50,
    "unit": "pieces",
    "previousStock": 550,
    "newStock": 500,
    "totalValue": 3250,
    "performedBy": "507f1f77bcf86cd799439010",
    "performedByName": "Priya Patel",
    "createdAt": "2024-01-15T14:20:00.000Z"
  },
  "updatedStock": 500
}
```

### Get Stock Movements

**GET** `/stock-movements`

Retrieve paginated stock movement history.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `skuId` (optional): Filter by specific SKU
- `movementType` (optional): Filter by type
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Example Request:**
```
GET /api/stock-movements?movementType=damage&startDate=2024-01-01&limit=20
```

**Response:**
```json
{
  "movements": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "sku": {
        "skuCode": "TILE-VIT-001",
        "name": "Vitrified Floor Tiles 600x600mm Glossy White",
        "category": "tiles"
      },
      "movementType": "damage",
      "quantity": 5,
      "previousStock": 505,
      "newStock": 500,
      "totalValue": 225,
      "reason": "Handling damage during unloading",
      "performedByName": "Amit Kumar",
      "createdAt": "2024-01-14T10:15:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 3
  }
}
```

### Get Movement Statistics

**GET** `/stock-movements/stats`

Get aggregate statistics on stock movements.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 30)

**Response:**
```json
{
  "stats": [
    {
      "_id": "inward",
      "count": 125,
      "totalQuantity": 5000,
      "totalValue": 250000
    },
    {
      "_id": "outward",
      "count": 230,
      "totalQuantity": 4500,
      "totalValue": 300000
    },
    {
      "_id": "damage",
      "count": 15,
      "totalQuantity": 50,
      "totalValue": 5000
    }
  ],
  "dailyMovements": [
    {
      "_id": "2024-01-15",
      "count": 12,
      "inward": 200,
      "outward": 150,
      "damage": 5
    }
  ]
}
```

---

## 📈 Analytics & Insights

### Get Dashboard Insights

**GET** `/analytics/insights`

Get smart insights including slow-moving SKUs, reorder suggestions, high-damage items.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `days` (optional): Analysis period in days (default: 30)

**Response:**
```json
{
  "slowMovingSKUs": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "skuCode": "LGT-CHD-001",
      "name": "Crystal Chandelier 8 Lights",
      "category": "lighting",
      "currentStock": 5,
      "costPrice": 15000,
      "lockedValue": 75000
    }
  ],
  "lowStockSKUs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "skuCode": "TILE-VIT-001",
      "name": "Vitrified Floor Tiles 600x600mm Glossy White",
      "currentStock": 85,
      "minReorderQuantity": 100,
      "supplier": "Kajaria Ceramics"
    }
  ],
  "reorderSuggestions": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "skuCode": "TILE-VIT-001",
      "name": "Vitrified Floor Tiles 600x600mm Glossy White",
      "currentStock": 85,
      "minReorderQuantity": 100,
      "avgDailySales": 12.5,
      "suggestedReorder": 375,
      "supplier": "Kajaria Ceramics"
    }
  ],
  "highDamageSKUs": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "skuCode": "SAN-WC-001",
      "skuName": "Western Toilet Single Piece White",
      "totalDamage": 3,
      "totalValue": 16500
    }
  ],
  "topPerformers": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "skuCode": "TILE-VIT-001",
      "skuName": "Vitrified Floor Tiles 600x600mm Glossy White",
      "totalSold": 500,
      "totalRevenue": 32500
    }
  ],
  "profitLeakage": [
    {
      "_id": "2024-01-15",
      "totalLoss": 5500
    }
  ]
}
```

### Generate Reports

**GET** `/analytics/reports`

Generate various analytical reports.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `reportType` (required): Type of report
  - `inventory-valuation`
  - `stock-movement-summary`
  - `abc-analysis`
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Example Request:**
```
GET /api/analytics/reports?reportType=abc-analysis
```

**Response (ABC Analysis):**
```json
{
  "report": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "skuCode": "TILE-VIT-001",
      "skuName": "Vitrified Floor Tiles 600x600mm Glossy White",
      "totalRevenue": 325000,
      "revenuePercentage": "32.50",
      "cumulativePercentage": "32.50",
      "classification": "A"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "skuCode": "SAN-WC-001",
      "skuName": "Western Toilet Single Piece White",
      "totalRevenue": 225000,
      "revenuePercentage": "22.50",
      "cumulativePercentage": "55.00",
      "classification": "A"
    }
  ]
}
```

---

## 📝 Audit Logs

### Get Audit Logs

**GET** `/audit`

Retrieve audit trail of all system activities (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `entityType` (optional): Filter by entity type (sku, stock, user, system)
- `performedBy` (optional): Filter by user ID
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**
```json
{
  "logs": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "action": "Stock outward",
      "entityType": "stock",
      "entityId": "507f1f77bcf86cd799439014",
      "performedBy": {
        "name": "Priya Patel",
        "email": "staff@insyd.com"
      },
      "performedByName": "Priya Patel",
      "performedByRole": "staff",
      "changes": {
        "sku": "TILE-VIT-001",
        "previousStock": 550,
        "newStock": 500,
        "quantity": 50
      },
      "timestamp": "2024-01-15T14:20:00.000Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "pages": 25
  }
}
```

---

## ⚠️ Error Handling

All API errors follow this format:

```json
{
  "message": "Error description",
  "errors": ["Detail 1", "Detail 2"] // Optional, for validation errors
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error, missing required fields |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

### Common Error Examples

**Validation Error:**
```json
{
  "message": "Validation Error",
  "errors": [
    "SKU code is required",
    "Cost price must be greater than 0"
  ]
}
```

**Authentication Error:**
```json
{
  "message": "Invalid or expired token"
}
```

**Insufficient Stock:**
```json
{
  "message": "Insufficient stock",
  "available": 30,
  "requested": 50
}
```

---

## 🔒 Rate Limiting

Currently no rate limiting in POC. For production:
- Implement rate limiting (100 requests/minute)
- Use Redis for distributed rate limiting
- Different limits for different endpoint types

---

## 📌 Notes

1. **Authentication**: All endpoints except `/auth/login` and `/auth/register` require JWT token
2. **Pagination**: Default page size is 50, max is 100
3. **Dates**: All dates are in ISO 8601 format (UTC)
4. **Currency**: All prices in Indian Rupees (₹)
5. **Transactions**: Stock movements use MongoDB transactions for data consistency

---

**Last Updated**: December 2024
