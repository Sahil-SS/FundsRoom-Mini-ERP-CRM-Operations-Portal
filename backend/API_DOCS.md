# FundsRoom API Documentation

FundsRoom is a Mini ERP/CRM Operations Portal backend for managing customers, products, inventory, delivery challans, and follow-ups. This document covers every REST endpoint exposed by the backend, including authentication, roles, request payloads, and response shapes.

---

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Roles & Permissions](#roles--permissions)
- [Response Envelope](#response-envelope)
- [Error Handling](#error-handling)
- [Pagination](#pagination)
- [Endpoints](#endpoints)
  - [Health](#health)
  - [Auth](#auth)
  - [Test / Protected Routes](#test--protected-routes)
  - [Customers](#customers)
  - [Follow-Ups](#follow-ups)
  - [Products](#products)
  - [Inventory / Stock Movements](#inventory--stock-movements)
  - [Challans](#challans)
  - [Dashboard](#dashboard)
- [Data Models](#data-models)

---

## Base URL

```
http://localhost:5000/api
```

The port is configurable via the `PORT` environment variable (defaults to `5000`). All routes below are relative to this base URL.

## Authentication

The API uses **JWT Bearer tokens**. After logging in via `POST /api/auth/login`, include the returned token on every subsequent request:

```
Authorization: Bearer <token>
```

Token expiry is controlled by `JWT_EXPIRES_IN` (defaults to `1d`).

If the header is missing, malformed, or the token is invalid/expired, the API responds with `401 Unauthorized`.

## Roles & Permissions

Every authenticated user has one role, defined on the `User` model:

| Role        | Description                                    |
| ----------- | ---------------------------------------------- |
| `ADMIN`     | Full access to all endpoints                   |
| `SALES`     | Manages customers, follow-ups, and challans    |
| `WAREHOUSE` | Manages products and inventory/stock movements |
| `ACCOUNTS`  | Read-only access across most modules           |

Each endpoint below lists which roles are permitted via `requireRole(...)` middleware. Requests from an authenticated user whose role isn't allowed receive `403 Forbidden`.

## Response Envelope

All successful responses follow this shape:

```json
{
  "success": true,
  "data": { ... }
}
```

List endpoints additionally include a `pagination` object (see [Pagination](#pagination)).

## Error Handling

Errors follow a consistent envelope:

```json
{
  "success": false,
  "message": "Human readable error message"
}
```

Validation errors (from Zod schemas) include a field-level `errors` array:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email address" }]
}
```

Common status codes:

| Status | Meaning                                                  |
| ------ | -------------------------------------------------------- |
| 200    | Success                                                  |
| 201    | Resource created                                         |
| 400    | Validation error / bad request / business rule violation |
| 401    | Missing, invalid, or expired auth token                  |
| 403    | Authenticated but role not permitted                     |
| 404    | Resource not found                                       |
| 409    | Conflict (e.g. duplicate SKU)                            |
| 500    | Internal server error                                    |

## Pagination

List endpoints (`GET` collection routes) accept:

| Query Param | Type   | Default | Notes                         |
| ----------- | ------ | ------- | ----------------------------- |
| `page`      | number | `1`     | Minimum `1`                   |
| `limit`     | number | `10`    | Clamped between `1` and `100` |

Response includes:

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

---

## Endpoints

### Health

#### `GET /api/health`

Basic health/liveness check. No authentication required.

**Response `200`**

```json
{
  "success": true,
  "message": "FundsRoom API is running",
  "environment": "development"
}
```

---

### Auth

#### `POST /api/auth/login`

Authenticates a user and returns a JWT.

- **Auth required:** No
- **Roles:** —

**Request Body**

| Field      | Type   | Required | Notes                 |
| ---------- | ------ | -------- | --------------------- |
| `email`    | string | Yes      | Must be a valid email |
| `password` | string | Yes      | Non-empty             |

```json
{
  "email": "admin@fundsroom.com",
  "password": "yourPassword123"
}
```

**Response `200`**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "b6a1e9f0-...",
      "name": "Admin User",
      "email": "admin@fundsroom.com",
      "role": "ADMIN"
    }
  }
}
```

**Errors**

- `401` — `Invalid email or password`
- `400` — Validation failure (bad email format / missing password)

---

### Test / Protected Routes

Utility endpoints used to sanity-check auth and role middleware. Not part of core business logic.

#### `GET /api/test/protected`

- **Auth required:** Yes (any authenticated user)

**Response `200`**

```json
{
  "success": true,
  "message": "You have access to this protected endpoint",
  "user": { "id": "...", "role": "ADMIN" }
}
```

#### `GET /api/test/admin-only`

- **Roles:** `ADMIN`

**Response `200`**

```json
{
  "success": true,
  "message": "You have admin access",
  "user": { "id": "...", "role": "ADMIN" }
}
```

#### `GET /api/test/sales-only`

- **Roles:** `SALES`

**Response `200`**

```json
{
  "success": true,
  "message": "You have sales access",
  "user": { "id": "...", "role": "SALES" }
}
```

---

### Customers

Base path: `/api/customers`

#### `POST /api/customers`

Create a new customer.

- **Roles:** `ADMIN`, `SALES`

**Request Body**

| Field          | Type   | Required | Notes                                                 |
| -------------- | ------ | -------- | ----------------------------------------------------- |
| `name`         | string | Yes      | 2–100 chars                                           |
| `mobile`       | string | Yes      | 10–15 chars                                           |
| `email`        | string | No       | Valid email or empty string                           |
| `businessName` | string | No       | Max 150 chars                                         |
| `gstNumber`    | string | No       | Max 15 chars                                          |
| `type`         | enum   | Yes      | `RETAIL` \| `WHOLESALE` \| `DISTRIBUTOR`              |
| `address`      | string | No       | Max 500 chars                                         |
| `status`       | enum   | No       | `LEAD` \| `ACTIVE` \| `INACTIVE` (defaults to `LEAD`) |
| `followUpDate` | string | No       | ISO 8601 datetime                                     |
| `notes`        | string | No       | Max 1000 chars                                        |

```json
{
  "name": "Rohan Traders",
  "mobile": "9876543210",
  "email": "rohan@traders.com",
  "businessName": "Rohan Traders Pvt Ltd",
  "gstNumber": "29ABCDE1234F1Z5",
  "type": "WHOLESALE",
  "address": "12 MG Road, Bengaluru",
  "status": "LEAD",
  "followUpDate": "2026-08-20T10:00:00.000Z",
  "notes": "Interested in bulk order"
}
```

**Response `201`** — Created `Customer` object.

---

#### `GET /api/customers`

List customers with search, filters, and pagination.

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Query Params**

| Param    | Type   | Notes                                                                   |
| -------- | ------ | ----------------------------------------------------------------------- |
| `page`   | number | See [Pagination](#pagination)                                           |
| `limit`  | number | See [Pagination](#pagination)                                           |
| `search` | string | Matches `name`, `mobile`, `email`, or `businessName` (case-insensitive) |
| `status` | enum   | `LEAD` \| `ACTIVE` \| `INACTIVE`                                        |
| `type`   | enum   | `RETAIL` \| `WHOLESALE` \| `DISTRIBUTOR`                                |

**Response `200`**

```json
{
  "success": true,
  "data": [ { "...Customer" } ],
  "pagination": { "page": 1, "limit": 10, "total": 24, "totalPages": 3 }
}
```

---

#### `GET /api/customers/:id`

Get a single customer, including their follow-up history and challan summary.

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Rohan Traders",
    "mobile": "9876543210",
    "email": "rohan@traders.com",
    "businessName": "Rohan Traders Pvt Ltd",
    "gstNumber": "29ABCDE1234F1Z5",
    "type": "WHOLESALE",
    "address": "12 MG Road, Bengaluru",
    "status": "LEAD",
    "followUpDate": "2026-08-20T10:00:00.000Z",
    "notes": "Interested in bulk order",
    "createdAt": "...",
    "updatedAt": "...",
    "followUps": [
      {
        "id": "...",
        "note": "Called, will confirm order",
        "followUpDate": "...",
        "createdAt": "..."
      }
    ],
    "challans": [
      {
        "id": "...",
        "challanNumber": "SC-000001",
        "status": "DRAFT",
        "totalQuantity": 10,
        "createdAt": "..."
      }
    ]
  }
}
```

**Errors:** `404` — `Customer not found`

---

#### `PUT /api/customers/:id`

Update a customer. Partial update — send only the fields you want to change.

- **Roles:** `ADMIN`, `SALES`

**Request Body:** Same fields as create, all optional (at least one field required).

**Response `200`** — Updated `Customer` object.

**Errors:** `404` — `Customer not found`; `400` — `At least one field is required for update`

---

### Follow-Ups

Base path: `/api` (mounted directly under the customer resource)

#### `POST /api/customers/:id/follow-ups`

Add a follow-up note to a customer. This also updates the customer's `followUpDate`.

- **Roles:** `ADMIN`, `SALES`

**Request Body**

| Field          | Type   | Required | Notes             |
| -------------- | ------ | -------- | ----------------- |
| `note`         | string | Yes      | 1–1000 chars      |
| `followUpDate` | string | Yes      | ISO 8601 datetime |

```json
{
  "note": "Customer requested a callback next week",
  "followUpDate": "2026-08-18T09:30:00.000Z"
}
```

**Response `201`** — Created `FollowUp` object.

**Errors:** `404` — `Customer not found`

---

#### `GET /api/customers/:id/follow-ups`

List all follow-ups for a customer, newest first.

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Response `200`**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "customerId": "...",
      "note": "...",
      "followUpDate": "...",
      "createdAt": "..."
    }
  ]
}
```

**Errors:** `404` — `Customer not found`

---

### Products

Base path: `/api/products`

#### `POST /api/products`

Create a new product.

- **Roles:** `ADMIN`, `WAREHOUSE`

**Request Body**

| Field               | Type   | Required | Notes                           |
| ------------------- | ------ | -------- | ------------------------------- |
| `name`              | string | Yes      | 2–150 chars                     |
| `sku`               | string | Yes      | 2–50 chars, must be unique      |
| `category`          | string | Yes      | 2–100 chars                     |
| `unitPrice`         | number | Yes      | Must be > 0                     |
| `minimumStock`      | number | No       | Integer, >= 0 (defaults to `0`) |
| `warehouseLocation` | string | No       | Max 150 chars                   |

```json
{
  "name": "Steel Pipe 2\"",
  "sku": "SP-002",
  "category": "Pipes",
  "unitPrice": 450.5,
  "minimumStock": 20,
  "warehouseLocation": "Rack A-3"
}
```

**Response `201`** — Created `Product` object (with `currentStock` initialized to `0`).

**Errors:** `409` — `A product with this SKU already exists`

---

#### `GET /api/products`

List products with search, category filter, low-stock filter, and pagination.

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Query Params**

| Param      | Type   | Notes                                                                      |
| ---------- | ------ | -------------------------------------------------------------------------- |
| `page`     | number | See [Pagination](#pagination)                                              |
| `limit`    | number | See [Pagination](#pagination)                                              |
| `search`   | string | Matches `name` or `sku` (case-insensitive)                                 |
| `category` | string | Exact match, case-insensitive                                              |
| `lowStock` | string | Pass `"true"` to return only products where `currentStock <= minimumStock` |

**Response `200`**

```json
{
  "success": true,
  "data": [ { "...Product" } ],
  "pagination": { "page": 1, "limit": 10, "total": 15, "totalPages": 2 }
}
```

> **Note:** When `lowStock=true`, pagination `total`/`totalPages` reflect the filtered low-stock count, not the full dataset.

---

#### `GET /api/products/:id`

Get a single product by ID.

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Response `200`** — `Product` object.

**Errors:** `404` — `Product not found`

---

#### `PUT /api/products/:id`

Update a product. Partial update — at least one field required.

- **Roles:** `ADMIN`, `WAREHOUSE`

**Request Body:** Same fields as create, all optional.

**Response `200`** — Updated `Product` object.

**Errors:**

- `404` — `Product not found`
- `409` — `A product with this SKU already exists` (if changing to a SKU already in use)
- `400` — `At least one field is required for update`

---

### Inventory / Stock Movements

Base path: `/api/inventory`

#### `POST /api/inventory/movements`

Record a stock movement (`IN` adds stock, `OUT` removes stock) and adjusts the related product's `currentStock` atomically.

- **Roles:** `ADMIN`, `WAREHOUSE`

**Request Body**

| Field       | Type   | Required | Notes                              |
| ----------- | ------ | -------- | ---------------------------------- |
| `productId` | string | Yes      | Must reference an existing product |
| `quantity`  | number | Yes      | Positive integer                   |
| `type`      | enum   | Yes      | `IN` \| `OUT`                      |
| `reason`    | string | Yes      | 1–255 chars                        |

```json
{
  "productId": "b6a1e9f0-...",
  "quantity": 50,
  "type": "IN",
  "reason": "New stock received from supplier"
}
```

**Response `201`**

```json
{
  "success": true,
  "data": {
    "movement": {
      "id": "...",
      "productId": "...",
      "quantity": 50,
      "type": "IN",
      "reason": "...",
      "createdAt": "..."
    },
    "product": { "id": "...", "currentStock": 120, "...": "..." }
  }
}
```

**Errors:**

- `404` — `Product not found`
- `400` — `Insufficient stock. Available stock: <n>` (when `type` is `OUT` and quantity exceeds `currentStock`)

---

#### `GET /api/inventory/movements`

List stock movements with filters and pagination.

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Query Params**

| Param       | Type   | Notes                         |
| ----------- | ------ | ----------------------------- |
| `page`      | number | See [Pagination](#pagination) |
| `limit`     | number | See [Pagination](#pagination) |
| `productId` | string | Filter by product             |
| `type`      | enum   | `IN` \| `OUT`                 |

**Response `200`**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "quantity": 50,
      "type": "IN",
      "reason": "New stock received",
      "createdAt": "...",
      "product": { "id": "...", "name": "Steel Pipe 2\"", "sku": "SP-002" },
      "createdBy": {
        "id": "...",
        "name": "Warehouse User",
        "role": "WAREHOUSE"
      }
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 8, "totalPages": 1 }
}
```

---

#### `GET /api/inventory/movements/:id`

Get a single stock movement by ID.

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Response `200`** — `StockMovement` object with nested `product` (including `currentStock`) and `createdBy`.

**Errors:** `404` — `Stock movement not found`

---

#### `GET /api/inventory/products/:productId/stock-movements`

Get the full stock movement history for a specific product (not paginated).

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "product": { "...Product" },
    "movements": [ { "...StockMovement", "createdBy": { "...": "..." } } ]
  }
}
```

**Errors:** `404` — `Product not found`

---

### Challans

A "Challan" is a delivery/dispatch document listing products and quantities sent to a customer. Base path: `/api/challans`

#### `POST /api/challans`

Create a new challan in `DRAFT` status. Auto-generates a sequential `challanNumber` (e.g. `SC-000001`). Snapshots product name, SKU, and unit price at creation time — stock is **not** deducted until confirmed.

- **Roles:** `ADMIN`, `SALES`

**Request Body**

| Field               | Type   | Required | Notes                                                                     |
| ------------------- | ------ | -------- | ------------------------------------------------------------------------- |
| `customerId`        | string | Yes      | Must reference an existing customer                                       |
| `items`             | array  | Yes      | At least 1 item                                                           |
| `items[].productId` | string | Yes      | Must reference an existing product; no duplicates within the same challan |
| `items[].quantity`  | number | Yes      | Positive integer                                                          |

```json
{
  "customerId": "b6a1e9f0-...",
  "items": [
    { "productId": "prod-1-id", "quantity": 10 },
    { "productId": "prod-2-id", "quantity": 5 }
  ]
}
```

**Response `201`**

```json
{
  "success": true,
  "data": {
    "id": "...",
    "challanNumber": "SC-000001",
    "customerId": "...",
    "status": "DRAFT",
    "totalQuantity": 15,
    "totalAmount": 6750.5,
    "customer": { "...Customer" },
    "items": [
      {
        "id": "...",
        "productId": "prod-1-id",
        "quantity": 10,
        "productNameSnapshot": "Steel Pipe 2\"",
        "skuSnapshot": "SP-002",
        "unitPriceSnapshot": 450.5
      }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:**

- `404` — `Customer not found`
- `400` — `A product cannot appear more than once in a challan`
- `404` — `One or more products were not found`

---

#### `GET /api/challans`

List challans with filters, pagination, and computed `totalAmount` per challan.

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Query Params**

| Param        | Type   | Notes                                 |
| ------------ | ------ | ------------------------------------- |
| `page`       | number | See [Pagination](#pagination)         |
| `limit`      | number | See [Pagination](#pagination)         |
| `status`     | enum   | `DRAFT` \| `CONFIRMED` \| `CANCELLED` |
| `customerId` | string | Filter by customer                    |

**Response `200`**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "challanNumber": "SC-000001",
      "status": "DRAFT",
      "totalQuantity": 15,
      "totalAmount": 6750.5,
      "customer": {
        "id": "...",
        "name": "Rohan Traders",
        "businessName": "..."
      },
      "createdBy": { "id": "...", "name": "Sales User", "role": "SALES" },
      "items": [{ "quantity": 10, "unitPriceSnapshot": 450.5 }]
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 6, "totalPages": 1 }
}
```

---

#### `GET /api/challans/:id`

Get full details of a single challan, including customer, creator, items, and computed `totalAmount`.

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Response `200`** — Full `Challan` object (same shape as the create response).

**Errors:** `404` — `Challan not found`

---

#### `POST /api/challans/:id/confirm`

Confirms a `DRAFT` challan: validates stock availability for every item, deducts stock from each product, creates corresponding `OUT` stock movements, and marks the challan `CONFIRMED`. Fully transactional — if any item fails stock validation, no changes are made.

- **Roles:** `ADMIN`, `SALES`

**Response `200`** — Updated `Challan` object with `status: "CONFIRMED"`.

**Errors:**

- `404` — `Challan not found`
- `400` — `Only DRAFT challans can be confirmed. Current status: <status>`
- `400` — `One or more products in the challan no longer exist`
- `400` — `Insufficient stock for <product>. Available: <n>, Required: <n>`

---

#### `POST /api/challans/:id/cancel`

Cancels a challan.

- If the challan is `DRAFT`, it's simply marked `CANCELLED`.
- If the challan is `CONFIRMED`, stock is restored for every item and corresponding `IN` stock movements are created (reason: `Cancellation of challan <number>`), then marked `CANCELLED`.

- **Roles:** `ADMIN`, `SALES`

**Response `200`** — Updated `Challan` object with `status: "CANCELLED"`.

**Errors:**

- `404` — `Challan not found`
- `400` — `Challan is already cancelled`
- `400` — `One or more products in the challan no longer exist` (when restoring stock for a confirmed challan)

---

### Dashboard

Base path: `/api/dashboard`

#### `GET /api/dashboard`

Returns aggregate metrics across customers, products, inventory, and challans for a summary/overview view.

- **Roles:** `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "customers": {
      "total": 42,
      "active": 20,
      "leads": 15
    },
    "products": {
      "total": 30,
      "lowStock": 4
    },
    "inventory": {
      "totalStockUnits": 3200
    },
    "challans": {
      "total": 18,
      "draft": 3,
      "confirmed": 14,
      "cancelled": 1
    }
  }
}
```

---

## Data Models

Summarized from `prisma/schema.prisma`.

### User

| Field        | Type                                            |
| ------------ | ----------------------------------------------- |
| id           | string (uuid)                                   |
| name         | string                                          |
| email        | string (unique)                                 |
| passwordHash | string (never returned by the API)              |
| role         | `ADMIN` \| `SALES` \| `WAREHOUSE` \| `ACCOUNTS` |
| createdAt    | datetime                                        |
| updatedAt    | datetime                                        |

### Customer

| Field        | Type                                     |
| ------------ | ---------------------------------------- |
| id           | string (uuid)                            |
| name         | string                                   |
| mobile       | string                                   |
| email        | string?                                  |
| businessName | string?                                  |
| gstNumber    | string?                                  |
| type         | `RETAIL` \| `WHOLESALE` \| `DISTRIBUTOR` |
| address      | string?                                  |
| status       | `LEAD` \| `ACTIVE` \| `INACTIVE`         |
| followUpDate | datetime?                                |
| notes        | string?                                  |
| createdById  | string?                                  |
| createdAt    | datetime                                 |
| updatedAt    | datetime                                 |

### FollowUp

| Field        | Type          |
| ------------ | ------------- |
| id           | string (uuid) |
| customerId   | string        |
| note         | string        |
| followUpDate | datetime      |
| createdById  | string?       |
| createdAt    | datetime      |

### Product

| Field             | Type            |
| ----------------- | --------------- |
| id                | string (uuid)   |
| name              | string          |
| sku               | string (unique) |
| category          | string          |
| unitPrice         | decimal(12,2)   |
| currentStock      | int (default 0) |
| minimumStock      | int (default 0) |
| warehouseLocation | string?         |
| createdAt         | datetime        |
| updatedAt         | datetime        |

### StockMovement

| Field       | Type          |
| ----------- | ------------- |
| id          | string (uuid) |
| productId   | string        |
| quantity    | int           |
| type        | `IN` \| `OUT` |
| reason      | string        |
| createdById | string?       |
| createdAt   | datetime      |

### Challan

| Field         | Type                                  |
| ------------- | ------------------------------------- |
| id            | string (uuid)                         |
| challanNumber | string (unique, e.g. `SC-000001`)     |
| customerId    | string                                |
| totalQuantity | int (default 0)                       |
| status        | `DRAFT` \| `CONFIRMED` \| `CANCELLED` |
| createdById   | string?                               |
| createdAt     | datetime                              |
| updatedAt     | datetime                              |

### ChallanItem

| Field               | Type          |
| ------------------- | ------------- |
| id                  | string (uuid) |
| challanId           | string        |
| productId           | string        |
| quantity            | int           |
| productNameSnapshot | string        |
| skuSnapshot         | string        |
| unitPriceSnapshot   | decimal(12,2) |
| createdAt           | datetime      |

---

## Route Summary

| Method | Path                                                 | Roles                             |
| ------ | ---------------------------------------------------- | --------------------------------- |
| GET    | `/api/health`                                        | Public                            |
| POST   | `/api/auth/login`                                    | Public                            |
| GET    | `/api/test/protected`                                | Any authenticated user            |
| GET    | `/api/test/admin-only`                               | ADMIN                             |
| GET    | `/api/test/sales-only`                               | SALES                             |
| POST   | `/api/customers`                                     | ADMIN, SALES                      |
| GET    | `/api/customers`                                     | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| GET    | `/api/customers/:id`                                 | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| PUT    | `/api/customers/:id`                                 | ADMIN, SALES                      |
| POST   | `/api/customers/:id/follow-ups`                      | ADMIN, SALES                      |
| GET    | `/api/customers/:id/follow-ups`                      | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| POST   | `/api/products`                                      | ADMIN, WAREHOUSE                  |
| GET    | `/api/products`                                      | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| GET    | `/api/products/:id`                                  | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| PUT    | `/api/products/:id`                                  | ADMIN, WAREHOUSE                  |
| POST   | `/api/inventory/movements`                           | ADMIN, WAREHOUSE                  |
| GET    | `/api/inventory/movements`                           | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| GET    | `/api/inventory/movements/:id`                       | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| GET    | `/api/inventory/products/:productId/stock-movements` | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| POST   | `/api/challans`                                      | ADMIN, SALES                      |
| GET    | `/api/challans`                                      | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| GET    | `/api/challans/:id`                                  | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| POST   | `/api/challans/:id/confirm`                          | ADMIN, SALES                      |
| POST   | `/api/challans/:id/cancel`                           | ADMIN, SALES                      |
| GET    | `/api/dashboard`                                     | ADMIN, SALES, WAREHOUSE, ACCOUNTS |

---

_Generated from the source at `backend/src` (routes, controllers, services, validators) and `backend/prisma/schema.prisma`._
