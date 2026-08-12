# FundsRoom — Backend

A production-style backend for a small wholesale/distribution ERP + CRM system, built around the business flow described in the Full Stack Developer Case Study: employee authentication, customer CRM, products and inventory, sales challans, REST APIs, validation, role-based access, database persistence, deployment, documentation, and DevOps.

---

## Deployment

| Service          | URL                                                    |
| ---------------- | ------------------------------------------------------ |
| Frontend         | https://funds-room-mini-erp-crm-operations.vercel.app/ |
| Backend API      | https://fundsroom-backend-9xiy.onrender.com/           |
| API Health Check | https://fundsroom-backend-9xiy.onrender.com/api/health |
| Database         | Supabase PostgreSQL                                    |

## Further Reading

| Doc                                      | Covers                                                              |
| ---------------------------------------- | ------------------------------------------------------------------- |
| [`API_DOCS.md`](./API_DOCS.md)           | Full endpoint reference, roles, payloads, responses, business rules |
| [`CONTRIBUTIONS.md`](./CONTRIBUTIONS.md) | Local setup, Prisma/DB workflow, testing, Docker, CI, PR process    |

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Case Study Requirements](#2-case-study-requirements)
- [3. Backend Scope](#3-backend-scope)
- [4. Technology Stack](#4-technology-stack)
- [5. Architecture](#5-architecture)
- [6. Design Philosophy](#6-design-philosophy)
- [7. Backend Thought Process](#7-backend-thought-process)
- [8. Project Structure](#8-project-structure)
- [9. Module Breakdown](#9-module-breakdown)
- [10. Authentication and Authorization](#10-authentication-and-authorization)
- [11. Customer CRM](#11-customer-crm)
- [12. Product Management](#12-product-management)
- [13. Inventory Management](#13-inventory-management)
- [14. Sales Challans](#14-sales-challans)
- [15. Dashboard](#15-dashboard)
- [16. Database Design](#16-database-design)
- [17. Important Business Rules](#17-important-business-rules)
- [18. API Design](#18-api-design)
- [19. Error Handling and Validation](#19-error-handling-and-validation)
- [20. Security](#20-security)
- [21. Environment Variables](#21-environment-variables)
- [22. Local Development](#22-local-development)
- [23. Automated Testing](#23-automated-testing)
- [24. Docker](#24-docker)
- [25. CI/CD](#25-cicd)
- [26. Deployment Strategy](#26-deployment-strategy)
- [27. Git Workflow](#27-git-workflow)
- [28. Known Limitations](#28-known-limitations)
- [29. Case-Study Requirement Mapping](#29-case-study-requirement-mapping)
- [30. Future Improvements](#30-future-improvements)

---

## 1. Project Overview

FundsRoom's backend provides the core business APIs used by Sales, Warehouse, Accounts, and Admin employees. The goal is **not** a huge enterprise system, but a demonstration of sound backend engineering: clean REST APIs, relational database design, authentication, role-based authorization, validation, error handling, transactional inventory consistency, pagination/filtering, automated testing, Docker, CI/CD, documentation, and deployability.

---

## 2. Case Study Requirements

The assignment describes a Mini ERP + CRM Operations Portal for a wholesale/distribution company with four employee roles — **Admin, Sales, Warehouse, Accounts** — and requires: authentication and roles, customer CRM, product and inventory management, sales challans, clean REST APIs, input validation, proper HTTP status codes and error messages, pagination/search where needed, a responsive frontend, deployment with environment-variable management, README/documentation, and a GitHub repo with meaningful commits.

The case study allows Supabase/PostgreSQL-style database hosting and free deployment platforms (Render, Railway, Fly.io, Vercel, Netlify, etc.); AWS is optional/bonus.

---

## 3. Backend Scope

```text
Authentication      JWT login · role authorization
Customer CRM        CRUD · search/filter · follow-ups
Products            CRUD · stock configuration
Inventory           IN/OUT movements · stock history
Sales Challans       Draft · Confirm · Cancel · stock integration · product snapshots
Dashboard            Operational summary
```

> Invoice generation and invoice PDF export are implemented entirely in the **frontend**, derived client-side from a confirmed challan (`GET /challans/:id`). There is no dedicated invoice endpoint or invoice table in this backend — see [`frontend/README.md`](../frontend/README.md#invoice-generation-and-pdf-export).

---

## 4. Technology Stack

**Runtime/Language:** Node.js + Express.js, implemented in **JavaScript**
**Database:** PostgreSQL (Supabase-hosted) · **ORM:** Prisma 7
**Auth:** JWT + bcrypt · **Validation:** Zod
**Security:** Helmet, CORS, environment variables
**Testing:** Jest + Supertest
**DevOps:** Docker, GitHub Actions, GitHub Container Registry
**API style:** REST / JSON, with pagination, filtering, and search

> **Stack note:** the case study lists Node.js + **TypeScript** + Express.js/NestJS. This implementation intentionally uses Node.js + Express.js + **JavaScript** to keep the codebase straightforward. This is the one deliberate, documented deviation from the requested backend stack — the frontend uses TypeScript throughout.

---

## 5. Architecture

```text
                    Client / Frontend
                           │
                           ▼
                    HTTP REST API
                           │
                           ▼
                    Express Routes
                           │
                           ▼
                    Middleware Layer
              ┌────────────┼────────────┐
         Authentication  Validation   Error Handling
              └────────────┴────────────┘
                           │
                           ▼
                      Controllers  (thin — request/response only)
                           │
                           ▼
                       Services    (business rules)
                           │
                           ▼
                         Prisma
                           │
                           ▼
                  Supabase PostgreSQL
```

---

## 6. Design Philosophy

> **Keep the implementation simple, but make the important business rules correct.**

Deliberately avoided: microservices, Kubernetes, event buses, Redis-for-everything, separate analytics databases, CQRS, over-engineered repository abstractions. A modular Express app with PostgreSQL and Prisma is sufficient for an ERP of this size. Engineering effort instead goes into: authentication, authorization, validation, inventory consistency, transactions, audit trail, error handling, and testing.

---

## 7. Backend Thought Process

**Start from the business workflow:**

```text
Login → Customer exists → Product exists → Stock exists
      → Sales creates DRAFT challan → Sales confirms
      → Inventory decreases → OUT movement recorded → CONFIRMED
```

**Separate master data from transactions:**

```text
Master data:      User, Customer, Product
Transactions:      StockMovement, Challan, ChallanItem, FollowUp
```

**Stock as a first-class concern:** `Product.currentStock` (current state) + `StockMovement` history (audit trail).

**Snapshots for challans:** a product's price today may change tomorrow — a challan must still represent what was true at the time of the transaction. Each `ChallanItem` therefore stores `productNameSnapshot`, `skuSnapshot`, `unitPriceSnapshot`.

**Transactions for critical operations:** challan confirmation touches challan status, product stock, and stock movements together — these must never partially succeed:

```text
BEGIN → check challan/products/stock → reduce stock → create OUT movements → update challan → COMMIT
                                                                    (or ROLLBACK on any failure)
```

The same all-or-nothing principle applies when cancelling a confirmed challan (restore stock, create IN movements, set CANCELLED).

---

## 8. Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/           database.js, env.js
│   ├── controllers/      auth, challan, customer, dashboard, followup, inventory, product
│   ├── middleware/        auth, error, role, validation
│   ├── routes/             auth, challan, customer, dashboard, followup, inventory, product, test
│   ├── services/           auth, challan, customer, dashboard, followup, inventory, product
│   ├── utils/              jwt.js, password.js
│   ├── validators/         auth, challan, customer, followup, inventory, product
│   ├── app.js
│   └── server.js
├── tests/
│   └── api.test.js
├── .github/workflows/
│   └── backend-ci-cd.yml
├── .dockerignore
├── .gitignore
├── API_DOCS.md
├── CONTRIBUTIONS.md
├── Dockerfile
├── package.json
├── prisma.config.ts
└── README.md
```

---

## 9. Module Breakdown

| Module             | Purpose                                                                         |
| ------------------ | ------------------------------------------------------------------------------- |
| **Authentication** | Authenticate employees, issue JWTs, protect and role-restrict APIs              |
| **Customer CRM**   | Store/search/update customers, track follow-ups                                 |
| **Product**        | Maintain product master data — SKU, price, stock thresholds                     |
| **Inventory**      | Track IN/OUT movements, prevent negative stock, maintain history                |
| **Sales Challan**  | Create/confirm/cancel challans, connect sales with inventory                    |
| **Dashboard**      | Operational summary — customers, products, low stock, inventory units, challans |

---

## 10. Authentication and Authorization

```http
POST /api/auth/login
```

```json
{ "email": "admin@example.com", "password": "PASSWORD" }
```

```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "USER_ID",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
}
```

**Flow:** Email + password → find user → compare bcrypt hash → generate JWT → return token → client sends `Bearer` token → JWT middleware verifies → role middleware checks permissions → controller.

| Role          | Access                                             |
| ------------- | -------------------------------------------------- |
| **ADMIN**     | Full administrative access                         |
| **SALES**     | Customer CRM and sales/challan workflows           |
| **WAREHOUSE** | Product/inventory operations and operational reads |
| **ACCOUNTS**  | Operational/read access                            |

The exact permission matrix lives in route-level authorization middleware — see [`API_DOCS.md`](./API_DOCS.md).

---

## 11. Customer CRM

Fields: `name`, `mobile`, `email`, `businessName`, `gstNumber`, `type`, `address`, `status`, `followUpDate`, `notes`.
Types: `RETAIL` · `WHOLESALE` · `DISTRIBUTOR`. Statuses: `LEAD` · `ACTIVE` · `INACTIVE`.
Supports create, read, update, search, filter, and follow-up tracking (kept inside the ERP rather than a separate CRM service).

---

## 12. Product Management

Fields: `name`, `sku`, `category`, `unitPrice`, `currentStock`, `minimumStock`, warehouse/location. Products are master data; **SKU** is the stable business identifier and must be unique.

**Low stock rule:** `currentStock <= minimumStock` — used by the dashboard.

---

## 13. Inventory Management

Every stock change is a `StockMovement` recording product, quantity, type (`IN`/`OUT`), reason, creator, and timestamp.

```text
Stock IN:   current 20 + 10  → 30
Stock OUT:  current 20 − 5   → 15
```

**Negative-stock protection** is a hard invariant: `currentStock >= 0`. `Available: 3, Requested OUT: 5` → rejected; stock stays `3`, never `-2`.

---

## 14. Sales Challans

Fields: `challanNumber`, `customer`, `items`, `totalQuantity`, `status`, `createdBy`, `createdDate`. Statuses: `DRAFT`, `CONFIRMED`, `CANCELLED`.

**Creating a challan:** validates customer → validates each product → validates quantities → generates a challan number → snapshots product details → calculates total quantity → creates as `DRAFT` (stock unchanged).

`totalAmount` is **derived**, not stored: `Σ(quantity × unitPriceSnapshot)`.

**Confirming:** `DRAFT` → validate → fetch products → check stock → reduce stock → create `OUT` movements → `CONFIRMED` (fully transactional).

**Cancelling a draft:** `DRAFT → CANCELLED`, stock unchanged.
**Cancelling a confirmed challan:** `CONFIRMED` → restore stock → create `IN` movements → `CANCELLED`.

```text
Initial stock 20 → Confirm (OUT 5) → 15 → Cancel (IN 5) → 20
```

---

## 15. Dashboard

```http
GET /api/dashboard
```

```json
{
  "customers": { "total": 4, "active": 3, "leads": 1 },
  "products": { "total": 9, "lowStock": 2 },
  "inventory": { "totalStockUnits": 123 },
  "challans": { "total": 4, "draft": 1, "confirmed": 2, "cancelled": 1 }
}
```

An operational dashboard, intentionally not a business-intelligence system.

---

## 16. Database Design

PostgreSQL via Supabase. Core entities: `User`, `Customer`, `FollowUp`, `Product`, `StockMovement`, `Challan`, `ChallanItem`.

```text
Customer 1───N FollowUp
Customer 1───N Challan
Challan  1───N ChallanItem
Product  1───N StockMovement
Product  1───N ChallanItem
User     1───N StockMovement
User     1───N Challan
```

`ChallanItem` stores `productId`, `quantity`, `productNameSnapshot`, `skuSnapshot`, `unitPriceSnapshot` — the snapshot fields preserve historical transaction accuracy independent of later product edits.

---

## 17. Important Business Rules

| #   | Rule                                                                                       |
| --- | ------------------------------------------------------------------------------------------ |
| 1   | Stock can never go negative                                                                |
| 2   | A draft challan never affects stock                                                        |
| 3   | Confirming a challan reduces stock, creates an OUT movement, sets `CONFIRMED`              |
| 4   | Insufficient stock rejects confirmation with **no** partial changes; challan stays `DRAFT` |
| 5   | Cancelling a confirmed challan reverses stock via `IN` movements                           |
| 6   | A cancelled challan cannot be cancelled again (prevents duplicate stock restoration)       |
| 7   | Product snapshots keep historical challans immutable to later product edits                |
| 8   | Every inventory change has a corresponding movement record (full audit trail)              |

---

## 18. API Design

```http
POST /api/auth/login
GET/POST  /api/customers            GET/PUT /api/customers/:id
POST/GET  /api/products             GET/PUT /api/products/:id
POST/GET  /api/inventory/movements
POST/GET  /api/challans             GET /api/challans/:id
POST /api/challans/:id/confirm      POST /api/challans/:id/cancel
GET  /api/dashboard
```

Full endpoint-level reference (payloads, query params, responses, error cases, cURL examples): [`API_DOCS.md`](./API_DOCS.md).

---

## 19. Error Handling and Validation

Centralized in `src/middleware/error.middleware.js`. Standard error shape:

```json
{ "success": false, "message": "Customer not found" }
```

| Status | Meaning                                          |
| ------ | ------------------------------------------------ |
| 400    | Bad request / validation / business-rule failure |
| 401    | Authentication failure                           |
| 403    | Authorization failure                            |
| 404    | Resource not found                               |
| 409    | Conflict (e.g. duplicate SKU)                    |
| 500    | Unexpected internal error                        |

Requests are validated by Zod-based middleware **before** they reach controllers, so invalid data never reaches business logic.

---

## 20. Security

- Passwords hashed with **bcrypt** — never returned by the API
- **JWT** for authenticated requests (`Authorization: Bearer <token>`)
- **Helmet** for security headers, **CORS** scoped to the frontend origin
- Secrets kept in environment variables — never committed to Git

---

## 21. Environment Variables

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

PORT=5000
NODE_ENV=development

JWT_SECRET="your-long-random-secret"
JWT_EXPIRES_IN="1d"

FRONTEND_URL="http://localhost:3000"
```

Use a dedicated test database for automated tests (`TEST_DATABASE_URL`, `TEST_DIRECT_URL`, `TEST_JWT_SECRET`) — never point tests at production data, and never commit `.env`.

---

## 22. Local Development

```bash
git clone <YOUR_REPOSITORY_URL>
cd fundsroom/backend
npm install
npx prisma generate
npm run dev            # http://localhost:5000
```

Health check: `http://localhost:5000/api/health`

For the full walkthrough (Prisma setup, migrations, Docker, troubleshooting), see [`CONTRIBUTIONS.md`](./CONTRIBUTIONS.md).

---

## 23. Automated Testing

```bash
npm test        # Jest + Supertest, run with --runInBand
```

Critical invariants the suite is designed to cover:

```text
Create DRAFT → stock unchanged → Confirm → stock decreases → OUT movement created
Cancel → stock restored → IN movement created

Multi-product challan, one product insufficient → confirmation fails →
no product stock changes → no OUT movements → challan remains DRAFT
```

---

## 24. Docker

```bash
cd backend
docker build -t fundsroom-backend .
docker run --env-file .env -p 5000:5000 fundsroom-backend
```

Container flow: Node 22 Alpine → install deps → copy Prisma schema/config → generate Prisma Client → copy app → expose `5000` → start server. Health check: `GET /api/health`. `.env` is **never** baked into the image — variables are injected at runtime.

---

## 25. CI/CD

GitHub Actions (`.github/workflows/backend-ci-cd.yml`):

```text
Push → Checkout → Setup Node.js → npm ci → Prisma generate → npm test
     → (on success) Build Docker image → Push to GitHub Container Registry
```

Tests run **before** the Docker build so a broken commit never produces a deployable image. Credentials are pulled from GitHub Actions secrets, never hardcoded in the workflow file.

---

## 26. Deployment Strategy

```text
Frontend (Vercel) ──HTTPS──► Backend (Render) ──PostgreSQL──► Supabase
```

Free-tier friendly: Render/Railway/Fly.io for the backend, Supabase/Neon/Render Postgres for the database. AWS is optional/bonus.

---

## 27. Git Workflow

```text
feat: implement customer management
feat: implement product management
feat: implement inventory movements
feat: implement challan workflow
feat: implement challan cancellation
feat: add dashboard summary
test: add authentication API tests
docs: add API documentation
ci: add backend CI/CD pipeline and Docker
```

---

## 28. Known Limitations

This is a compact ERP/CRM case-study backend, not a complete enterprise ERP:

1. No purchase-order module
2. No backend invoice storage or invoice CRUD API — invoicing is generated client-side from a confirmed challan (see [`frontend/README.md`](../frontend/README.md#invoice-generation-and-pdf-export))
3. No payment/accounting ledger
4. No advanced reporting engine or historical analytics endpoints
5. No real-time notifications
6. No advanced warehouse/bin management or multi-warehouse transfers
7. No production-grade observability stack (structured logging, tracing, metrics)

---

## 29. Case-Study Requirement Mapping

| Requirement                                                          | Status                                                |
| -------------------------------------------------------------------- | ----------------------------------------------------- |
| Node.js, Express.js, PostgreSQL, REST APIs                           | ✅                                                    |
| JWT authentication, 4 roles                                          | ✅                                                    |
| Customer management, search, follow-ups                              | ✅                                                    |
| Product management (SKU, price, stock thresholds)                    | ✅                                                    |
| Inventory movements (IN/OUT, creator, timestamp)                     | ✅                                                    |
| Sales challans — number, Draft/Confirmed/Cancelled                   | ✅                                                    |
| Stock reduction, negative-stock prevention, insufficient-stock error | ✅                                                    |
| Product snapshots                                                    | ✅                                                    |
| Validation, HTTP status codes, error handling                        | ✅                                                    |
| Pagination, search/filter                                            | ✅                                                    |
| Environment variables, README                                        | ✅                                                    |
| Docker bonus                                                         | ✅                                                    |
| GitHub Actions bonus                                                 | ✅                                                    |
| API documentation                                                    | ✅                                                    |
| **TypeScript backend**                                               | ⚠️ Deviation — implemented in JavaScript (documented) |

---

## 30. Future Improvements

**Purchase Orders:** Supplier → PO → Goods Received → Stock IN
**Payments/Invoicing backend:** persist invoices generated from confirmed challans, add payment tracking
**Notifications:** low stock, follow-up due, challan confirmed
**Advanced audit logs:** who/what/when/old-value/new-value
**Observability:** structured logging, request IDs, metrics, tracing, error monitoring

---

## Final Architecture Summary

```text
                         ┌───────────────────────┐
                         │       Frontend        │
                         │     React / Next.js   │
                         └───────────┬───────────┘
                                     │ HTTPS
                                     ▼
                         ┌───────────────────────┐
                         │     Express API       │
                         └───────────┬───────────┘
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
              Authentication   Validation       Error Handler
                    └────────────────┴────────────────┘
                                     ▼
                                Controllers → Services
                             ┌──────────┼──────────┐
                             ▼          ▼          ▼
                         Customer   Product     Challan
                                        │            │
                                        └─ Inventory ◄┘
                                             │
                                           Prisma
                                             │
                                    Supabase PostgreSQL
```

```text
STOCK CONSISTENCY
  DRAFT     → no stock change
  CONFIRM   → OUT movement + decrease
  CANCEL    → IN movement + restore
  Insufficient stock → rollback
```

This invariant is the core of the backend's business correctness.

---

**Backend:** Node.js + Express.js + JavaScript · **Database:** Supabase PostgreSQL · **ORM:** Prisma
**Auth:** JWT · **Testing:** Jest + Supertest · **Containerization:** Docker · **CI/CD:** GitHub Actions
