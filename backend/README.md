# FundsRoom ERP + CRM Operations Portal --- Backend

A production-style backend for a small wholesale/distribution ERP + CRM
system.

The system is designed around the business flow described in the Full
Stack Developer Case Study: employee authentication, customer CRM,
products and inventory, sales challans, REST APIs, validation,
role-based access, database persistence, deployment, documentation, and
DevOps.

> **Case-study reference:** The assignment requires a Mini ERP + CRM
> Operations Portal for a wholesale/distribution company, with
> customers, products, stock, sales challans, CRM follow-ups, REST APIs,
> validation, deployment, documentation, and proper Git commits.
> fileciteturn2file0

------------------------------------------------------------------------

## Deployment

> Add your deployed URLs here when deployment is complete.

| Service | URL |
|---|---|
| Frontend | `YOUR_FRONTEND_DEPLOYED_URL` |
| Backend API | `YOUR_BACKEND_DEPLOYED_URL` |
| API Health Check | `YOUR_BACKEND_DEPLOYED_URL/api/health` |
| Database | `Supabase project / database URL` |

## API Documentation

Detailed API documentation is maintained separately in:

**[`API_DOCS.md`](./API_DOCS.md)**

It contains the complete endpoint reference, including:

- HTTP methods and routes
- Authentication requirements
- Role permissions
- Request payloads
- Query/path parameters
- Response examples
- Error responses
- Challan lifecycle
- Inventory business rules
- cURL examples

## Contributing / Local Setup

For the complete developer setup and contribution process, see:

**[`CONTRIBUTIONS.md`](./CONTRIBUTIONS.md)**

It covers:

- Required software
- Repository setup
- Dependency installation
- Environment variables
- Supabase/Prisma setup
- Running the backend
- Running automated tests
- Docker commands
- GitHub Actions/CI
- Making code changes
- Database changes
- Adding new API endpoints
- Commit conventions
- Pull request workflow
- Troubleshooting
- Quick-start commands

# Table of Contents

-   [1. Project Overview](#1-project-overview)
-   [2. Case Study Requirements](#2-case-study-requirements)
-   [3. Backend Scope](#3-backend-scope)
-   [4. Technology Stack](#4-technology-stack)
-   [5. Architecture](#5-architecture)
-   [6. Design Philosophy](#6-design-philosophy)
-   [7. Backend Thought Process](#7-backend-thought-process)
-   [8. Project Structure](#8-project-structure)
-   [9. Module Breakdown](#9-module-breakdown)
-   [10. Authentication and
    Authorization](#10-authentication-and-authorization)
-   [11. Customer CRM](#11-customer-crm)
-   [12. Customer Follow-Ups](#12-customer-follow-ups)
-   [13. Product Management](#13-product-management)
-   [14. Inventory Management](#14-inventory-management)
-   [15. Sales Challans](#15-sales-challans)
-   [16. Dashboard](#16-dashboard)
-   [17. Database Design](#17-database-design)
-   [18. Important Business Rules](#18-important-business-rules)
-   [19. API Design](#19-api-design)
-   [20. Error Handling](#20-error-handling)
-   [21. Validation](#21-validation)
-   [22. Security](#22-security)
-   [23. Environment Variables](#23-environment-variables)
-   [24. Local Development](#24-local-development)
-   [25. Database Setup](#25-database-setup)
-   [26. Automated Testing](#26-automated-testing)
-   [27. Docker](#27-docker)
-   [28. CI/CD](#28-cicd)
-   [29. Deployment Strategy](#29-deployment-strategy)
-   [30. API Documentation](#30-api-documentation)
-   [31. Git Workflow](#31-git-workflow)
-   [32. Suggested Commit History](#32-suggested-commit-history)
-   [33. End-to-End Business Flows](#33-end-to-end-business-flows)
-   [34. Testing Checklist](#34-testing-checklist)
-   [35. Known Limitations](#35-known-limitations)
-   [36. Case-Study Requirement
    Mapping](#36-case-study-requirement-mapping)
-   [37. Future Improvements](#37-future-improvements)
-   [38. Final Submission Checklist](#38-final-submission-checklist)

------------------------------------------------------------------------

# 1. Project Overview

FundsRoom is a backend-first implementation of a small ERP + CRM
Operations Portal for a wholesale/distribution business.

The backend provides the core business APIs used by employees in:

-   Sales
-   Warehouse
-   Accounts
-   Administration

The objective is **not** to build a huge enterprise system. The
objective is to demonstrate sound full-stack/backend engineering:

-   Clean REST APIs
-   Relational database design
-   Authentication
-   Role-based authorization
-   Input validation
-   Error handling
-   Inventory consistency
-   Transactional business operations
-   Pagination and filtering
-   Automated testing
-   Docker
-   CI/CD
-   Documentation
-   Deployability

The original assignment explicitly states that the goal is to
demonstrate understanding of full-stack development, backend APIs,
database design, frontend UI, deployment, and real-world business flow
rather than building a huge system. fileciteturn2file0

------------------------------------------------------------------------

# 2. Case Study Requirements

The assignment describes a Mini ERP + CRM Operations Portal for a
wholesale/distribution company.

The required business areas are:

1.  Authentication and roles
2.  Customer CRM
3.  Product and inventory management
4.  Sales challans
5.  Clean REST APIs
6.  Input validation
7.  Proper HTTP status codes
8.  Error messages
9.  Pagination where needed
10. Search/filter where needed
11. Responsive frontend
12. Deployment
13. Environment-variable management
14. README/documentation
15. GitHub repository with proper commits

The required employee roles are:

``` text
ADMIN
SALES
WAREHOUSE
ACCOUNTS
```

The case study also allows PostgreSQL/Supabase-style database hosting
and lists free deployment platforms such as Render, Railway, Fly.io,
Vercel, Netlify, and similar services. AWS is optional and receives
bonus consideration. fileciteturn2file0

------------------------------------------------------------------------

# 3. Backend Scope

The backend currently focuses on these modules:

``` text
Authentication
     │
     ├── JWT login
     └── Role authorization

Customer CRM
     │
     ├── Customer CRUD
     ├── Search/filter
     └── Follow-ups

Products
     │
     ├── Product CRUD
     └── Stock configuration

Inventory
     │
     ├── IN movements
     ├── OUT movements
     └── Stock history

Sales Challans
     │
     ├── Draft
     ├── Confirm
     ├── Cancel
     ├── Stock integration
     └── Product snapshots

Dashboard
     │
     └── Operational summary
```

------------------------------------------------------------------------

# 4. Technology Stack

## Runtime

-   Node.js
-   Express.js

## Language

The backend implementation uses **JavaScript**, not TypeScript.

> The original case study lists Node.js with TypeScript and
> Express.js/NestJS as the expected backend stack. This implementation
> intentionally uses Node.js + Express.js + JavaScript to keep the
> case-study implementation straightforward and aligned with the
> project's current codebase. fileciteturn2file0

## Database

-   PostgreSQL
-   Supabase-hosted PostgreSQL

## ORM

-   Prisma 7

## Authentication

-   JWT
-   bcrypt password hashing

## Validation

-   Zod-based validation middleware

## Security

-   Helmet
-   CORS
-   JWT authorization
-   Password hashing
-   Environment variables

## Testing

-   Jest
-   Supertest

## DevOps

-   Docker
-   GitHub Actions
-   GitHub Container Registry

## API Style

-   REST
-   JSON
-   HTTP status codes
-   Pagination
-   Filtering
-   Search

------------------------------------------------------------------------

# 5. Architecture

The backend follows a layered architecture:

``` text
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
              │            │            │
         Authentication  Validation   Error Handling
              │            │
              └────────────┴────────────┘
                           │
                           ▼
                      Controllers
                           │
                           ▼
                       Services
                           │
                           ▼
                         Prisma
                           │
                           ▼
                  Supabase PostgreSQL
```

## Responsibilities

### Routes

Routes define:

-   HTTP method
-   URL
-   Middleware
-   Controller

### Middleware

Middleware handles cross-cutting concerns:

-   Authentication
-   Role authorization
-   Request validation
-   Global error handling

### Controllers

Controllers handle:

-   Request extraction
-   Calling services
-   HTTP status codes
-   Response formatting

Controllers intentionally contain minimal business logic.

### Services

Services contain business rules such as:

-   Creating customers
-   Creating products
-   Updating stock
-   Creating challans
-   Confirming challans
-   Cancelling challans
-   Dashboard calculations

### Prisma

Prisma handles:

-   Database queries
-   Relations
-   Transactions
-   Data persistence

------------------------------------------------------------------------

# 6. Design Philosophy

The project follows one major principle:

> **Keep the implementation simple, but make the important business
> rules correct.**

The project deliberately avoids unnecessary complexity such as:

-   Microservices
-   Kubernetes
-   Event buses
-   Redis for everything
-   Separate analytics databases
-   Complex CQRS
-   Over-engineered repository abstractions

The ERP is small. A modular Express application with PostgreSQL and
Prisma is sufficient.

The most important engineering effort goes into correctness:

``` text
Authentication
Authorization
Validation
Inventory consistency
Transactions
Audit trail
Error handling
Testing
```

------------------------------------------------------------------------

# 7. Backend Thought Process

## 7.1 Start from the business workflow

Instead of beginning with random endpoints, the backend was designed
around the actual business flow:

``` text
Employee logs in
       ↓
Customer exists
       ↓
Product exists
       ↓
Stock exists
       ↓
Sales creates challan
       ↓
Challan starts as DRAFT
       ↓
Sales confirms challan
       ↓
Inventory decreases
       ↓
OUT movement is recorded
       ↓
Challan becomes CONFIRMED
```

This makes the API reflect the real business process.

------------------------------------------------------------------------

## 7.2 Separate master data from transactions

Master data:

``` text
Customer
Product
User
```

Transactions:

``` text
StockMovement
Challan
ChallanItem
FollowUp
```

This separation makes the database easier to reason about.

------------------------------------------------------------------------

## 7.3 Keep stock as a first-class business concern

Inventory is not simply a `currentStock` number.

The system maintains:

``` text
Product.currentStock
        +
StockMovement history
```

This provides both:

-   Current state
-   Historical audit trail

------------------------------------------------------------------------

## 7.4 Use snapshots for challans

A challan should not depend entirely on the current Product record.

For example:

``` text
Product today:
4K Monitor
₹18,500
```

A future product update might change the price to:

``` text
₹20,000
```

The old challan must still represent the original transaction.

Therefore each challan item stores:

``` text
productNameSnapshot
skuSnapshot
unitPriceSnapshot
```

This follows the assignment requirement that a challan should store
product snapshot data rather than only a product ID.
fileciteturn2file0

------------------------------------------------------------------------

## 7.5 Use transactions for critical operations

Challan confirmation changes multiple records:

``` text
Challan status
Product stock
Stock movements
```

These must not partially succeed.

Therefore confirmation is executed transactionally:

``` text
BEGIN TRANSACTION

Check challan
Check products
Check stock
Reduce stock
Create OUT movements
Update challan

COMMIT
```

If anything fails:

``` text
ROLLBACK
```

The same principle is used when cancelling a confirmed challan:

``` text
Restore stock
Create IN movement
Set challan CANCELLED
```

------------------------------------------------------------------------

# 8. Project Structure

Recommended repository structure:

```
├── 📁 .agents
│   └── 📁 skills
│       ├── 📁 prisma-cli
│       │   ├── 📁 references
│       │   │   ├── 📝 agent-safety.md
│       │   │   ├── 📝 complete.md
│       │   │   ├── 📝 db-execute.md
│       │   │   ├── 📝 db-pull.md
│       │   │   ├── 📝 db-push.md
│       │   │   ├── 📝 db-seed.md
│       │   │   ├── 📝 debug.md
│       │   │   ├── 📝 dev.md
│       │   │   ├── 📝 format.md
│       │   │   ├── 📝 generate.md
│       │   │   ├── 📝 init.md
│       │   │   ├── 📝 mcp.md
│       │   │   ├── 📝 migrate-deploy.md
│       │   │   ├── 📝 migrate-dev.md
│       │   │   ├── 📝 migrate-diff.md
│       │   │   ├── 📝 migrate-reset.md
│       │   │   ├── 📝 migrate-resolve.md
│       │   │   ├── 📝 migrate-status.md
│       │   │   ├── 📝 studio.md
│       │   │   └── 📝 validate.md
│       │   └── 📝 SKILL.md
│       ├── 📁 prisma-client-api
│       │   ├── 📁 references
│       │   │   ├── 📝 client-methods.md
│       │   │   ├── 📝 constructor.md
│       │   │   ├── 📝 filters.md
│       │   │   ├── 📝 model-queries.md
│       │   │   ├── 📝 query-options.md
│       │   │   ├── 📝 raw-queries.md
│       │   │   ├── 📝 relations.md
│       │   │   └── 📝 transactions.md
│       │   └── 📝 SKILL.md
│       ├── 📁 prisma-compute
│       │   ├── 📁 references
│       │   │   ├── 📝 app-deploy-cli.md
│       │   │   ├── 📝 compute-config.md
│       │   │   ├── 📝 create-prisma.md
│       │   │   ├── 📝 frameworks.md
│       │   │   ├── 📝 sdk-api.md
│       │   │   └── 📝 troubleshooting.md
│       │   └── 📝 SKILL.md
│       ├── 📁 prisma-database-setup
│       │   ├── 📁 references
│       │   │   ├── 📝 cockroachdb.md
│       │   │   ├── 📝 mongodb.md
│       │   │   ├── 📝 mysql.md
│       │   │   ├── 📝 postgresql.md
│       │   │   ├── 📝 prisma-client-setup.md
│       │   │   ├── 📝 prisma-postgres.md
│       │   │   ├── 📝 sqlite.md
│       │   │   └── 📝 sqlserver.md
│       │   └── 📝 SKILL.md
│       ├── 📁 prisma-driver-adapter-implementation
│       │   └── 📝 SKILL.md
│       ├── 📁 prisma-mongodb-upgrade
│       │   ├── 📁 references
│       │   │   ├── 📝 client-api-mapping.md
│       │   │   ├── 📝 decision-stay-or-migrate.md
│       │   │   ├── 📝 migrations-mapping.md
│       │   │   ├── 📝 schema-contract-mapping.md
│       │   │   └── 📝 verify-cutover-checklist.md
│       │   └── 📝 SKILL.md
│       ├── 📁 prisma-postgres
│       │   ├── 📁 references
│       │   │   ├── 📝 console-and-connections.md
│       │   │   ├── 📝 create-db-cli.md
│       │   │   ├── 📝 management-api-sdk.md
│       │   │   └── 📝 management-api.md
│       │   └── 📝 SKILL.md
│       ├── 📁 prisma-postgres-setup
│       │   ├── 📁 references
│       │   │   ├── 📝 api-basics.md
│       │   │   ├── 📝 auth.md
│       │   │   ├── 📝 endpoints.md
│       │   │   └── 📝 prisma7-client.md
│       │   └── 📝 SKILL.md
│       └── 📁 prisma-upgrade-v7
│           ├── 📁 references
│           │   ├── 📝 accelerate-users.md
│           │   ├── 📝 driver-adapters.md
│           │   ├── 📝 env-variables.md
│           │   ├── 📝 esm-support.md
│           │   ├── 📝 prisma-config.md
│           │   ├── 📝 removed-features.md
│           │   └── 📝 schema-changes.md
│           └── 📝 SKILL.md
├── 📁 .claude
│   └── 📁 skills
│       ├── 📄 prisma-cli
│       ├── 📄 prisma-client-api
│       ├── 📄 prisma-compute
│       ├── 📄 prisma-database-setup
│       ├── 📄 prisma-driver-adapter-implementation
│       ├── 📄 prisma-mongodb-upgrade
│       ├── 📄 prisma-postgres
│       ├── 📄 prisma-postgres-setup
│       └── 📄 prisma-upgrade-v7
├── 📁 .github
│   └── 📁 workflows
│       └── ⚙️ backend-ci-cd.yml
├── 📁 .windsurf
│   └── 📁 skills
│       ├── 📄 prisma-cli
│       ├── 📄 prisma-client-api
│       ├── 📄 prisma-compute
│       ├── 📄 prisma-database-setup
│       ├── 📄 prisma-driver-adapter-implementation
│       ├── 📄 prisma-mongodb-upgrade
│       ├── 📄 prisma-postgres
│       ├── 📄 prisma-postgres-setup
│       └── 📄 prisma-upgrade-v7
├── 📁 generated
├── 📁 prisma
│   ├── 📁 migrations
│   │   ├── 📁 20260811082028_init
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   ├── 📄 schema.prisma
│   └── 📄 seed.js
├── 📁 src
│   ├── 📁 config
│   │   ├── 📄 database.js
│   │   └── 📄 env.js
│   ├── 📁 controllers
│   │   ├── 📄 auth.controller.js
│   │   ├── 📄 challan.controller.js
│   │   ├── 📄 customer.controller.js
│   │   ├── 📄 dashboard.controller.js
│   │   ├── 📄 followup.controller.js
│   │   ├── 📄 inventory.controller.js
│   │   └── 📄 product.controller.js
│   ├── 📁 middleware
│   │   ├── 📄 auth.middleware.js
│   │   ├── 📄 error.middleware.js
│   │   ├── 📄 role.middleware.js
│   │   └── 📄 validation.middleware.js
│   ├── 📁 routes
│   │   ├── 📄 auth.routes.js
│   │   ├── 📄 challan.routes.js
│   │   ├── 📄 customer.routes.js
│   │   ├── 📄 dashboard.routes.js
│   │   ├── 📄 followup.routes.js
│   │   ├── 📄 inventory.routes.js
│   │   ├── 📄 product.routes.js
│   │   └── 📄 test.routes.js
│   ├── 📁 services
│   │   ├── 📄 auth.service.js
│   │   ├── 📄 challan.service.js
│   │   ├── 📄 customer.service.js
│   │   ├── 📄 dashboard.service.js
│   │   ├── 📄 followup.service.js
│   │   ├── 📄 inventory.service.js
│   │   └── 📄 product.service.js
│   ├── 📁 utils
│   │   ├── 📄 jwt.js
│   │   └── 📄 password.js
│   ├── 📁 validators
│   │   ├── 📄 auth.validator.js
│   │   ├── 📄 challan.validator.js
│   │   ├── 📄 customer.validator.js
│   │   ├── 📄 followup.validator.js
│   │   ├── 📄 inventory.validator.js
│   │   └── 📄 product.validator.js
│   ├── 📄 app.js
│   └── 📄 server.js
├── 📁 tests
│   └── 📄 api.test.js
├── ⚙️ .dockerignore
├── ⚙️ .gitignore
├── 📝 API_DOCS.md
├── 📝 CONTRIBUTIONS.md
├── 🐳 Dockerfile
├── 📝 README.md
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 prisma.config.ts
└── ⚙️ skills-lock.json
```

> Exact filenames should always follow the repository's current source
> tree. The tree above documents the backend architecture and the files
> used by the implementation.

------------------------------------------------------------------------

# 9. Module Breakdown

## Module 1 --- Authentication

Purpose:

-   Authenticate employees
-   Generate JWT
-   Protect APIs
-   Restrict APIs by role

------------------------------------------------------------------------

## Module 2 --- Customer CRM

Purpose:

-   Store customers
-   Search customers
-   Update customer information
-   Track follow-ups

------------------------------------------------------------------------

## Module 3 --- Product

Purpose:

-   Maintain product master data
-   Store SKU
-   Store price
-   Store stock thresholds

------------------------------------------------------------------------

## Module 4 --- Inventory

Purpose:

-   Track IN movements
-   Track OUT movements
-   Prevent negative stock
-   Maintain stock history

------------------------------------------------------------------------

## Module 5 --- Sales Challan

Purpose:

-   Create draft challans
-   Confirm challans
-   Cancel challans
-   Connect sales with inventory

------------------------------------------------------------------------

## Module 6 --- Dashboard

Purpose:

Provide operational summary:

``` text
Customers
Products
Low stock
Inventory units
Challans
```

------------------------------------------------------------------------

# 10. Authentication and Authorization

## Login

``` http
POST /api/auth/login
```

Request:

``` json
{
  "email": "admin@example.com",
  "password": "PASSWORD"
}
```

Response:

``` json
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

------------------------------------------------------------------------

## JWT Flow

``` text
Email + Password
       ↓
Find user
       ↓
Compare bcrypt hash
       ↓
Generate JWT
       ↓
Return token
       ↓
Client sends Bearer token
       ↓
JWT middleware verifies token
       ↓
Role middleware checks permissions
       ↓
Controller
```

------------------------------------------------------------------------

## Roles

### ADMIN

Full administrative access.

### SALES

Customer CRM and sales/challan workflows.

### WAREHOUSE

Product/inventory operations and operational reads.

### ACCOUNTS

Operational/read access needed for accounts workflows.

The exact permission matrix is defined by route-level authorization
middleware.

------------------------------------------------------------------------

# 11. Customer CRM

Customer fields include:

``` text
name
mobile
email
businessName
gstNumber
type
address
status
followUpDate
notes
```

The assignment specifically requires customer name, mobile, email,
business name, optional GST number, customer type, address, status,
follow-up date, and notes. fileciteturn2file0

Customer statuses:

``` text
LEAD
ACTIVE
INACTIVE
```

Customer types:

``` text
RETAIL
WHOLESALE
DISTRIBUTOR
```

The CRM supports:

``` text
Create
Read
Update
Search
Filter
Follow-up tracking
```

------------------------------------------------------------------------

# 12. Customer Follow-Ups

Follow-ups are associated with customers.

Example:

``` json
{
  "followUpDate": "2026-08-20T10:00:00.000Z",
  "notes": "Call customer regarding bulk order."
}
```

Business use:

``` text
Customer
   ↓
Follow-up date
   ↓
Sales representative
   ↓
Follow-up notes
```

This keeps basic CRM functionality inside the ERP rather than creating a
separate CRM service.

------------------------------------------------------------------------

# 13. Product Management

Product fields include:

``` text
name
sku
category
unitPrice
currentStock
minimumStock
location / warehouse information
```

The assignment requires product name, SKU/code, category, unit price,
current stock, minimum stock alert quantity, and warehouse/location.
fileciteturn2file0

Products are treated as master data.

------------------------------------------------------------------------

## SKU

SKU is used as the stable business identifier for products.

Example:

``` text
MONITOR-001
```

A duplicate SKU should not be accepted.

------------------------------------------------------------------------

## Low Stock

A product is low stock when:

``` text
currentStock <= minimumStock
```

The dashboard uses this rule.

------------------------------------------------------------------------

# 14. Inventory Management

Inventory changes are represented by stock movements.

Movement types:

``` text
IN
OUT
```

Each movement records:

``` text
Product
Quantity
Type
Reason
Created by
Timestamp
```

These fields correspond directly to the case-study stock movement
requirement. fileciteturn2file0

------------------------------------------------------------------------

## Stock IN

Example:

``` text
Current stock = 20
IN quantity   = 10
--------------------
New stock     = 30
```

------------------------------------------------------------------------

## Stock OUT

Example:

``` text
Current stock = 20
OUT quantity  = 5
--------------------
New stock     = 15
```

------------------------------------------------------------------------

## Negative Stock Protection

This is a critical invariant:

``` text
currentStock >= 0
```

If:

``` text
currentStock = 3
requested OUT = 5
```

the operation is rejected.

Stock becomes:

``` text
3
```

not:

``` text
-2
```

------------------------------------------------------------------------

# 15. Sales Challans

The sales challan is the central transactional workflow.

## Challan fields

``` text
challanNumber
customer
products/items
totalQuantity
status
createdBy
createdDate
```

The assignment explicitly requires these fields and the statuses Draft,
Confirmed, and Cancelled. fileciteturn2file0

------------------------------------------------------------------------

## Creating a Challan

Request:

``` json
{
  "customerId": "CUSTOMER_ID",
  "items": [
    {
      "productId": "PRODUCT_ID",
      "quantity": 5
    }
  ]
}
```

The system:

1.  Validates the customer.
2.  Validates each product.
3.  Validates quantity.
4.  Generates a challan number.
5.  Reads product details.
6.  Creates product snapshots.
7.  Calculates total quantity.
8.  Creates the challan as `DRAFT`.

Creating a draft does not change stock.

------------------------------------------------------------------------

## Total Amount

The database does not need a separate `totalAmount` column.

It is derived from the item snapshots:

``` text
totalAmount =
Σ(quantity × unitPriceSnapshot)
```

Example:

``` text
Product: 4K Monitor
Quantity: 5
Unit price: ₹18,500

5 × 18,500
= ₹92,500
```

This calculation is performed at the application/API layer.

------------------------------------------------------------------------

## Confirming a Challan

Workflow:

``` text
DRAFT
  ↓
Validate state
  ↓
Fetch products
  ↓
Check stock
  ↓
Reduce stock
  ↓
Create OUT movements
  ↓
Set CONFIRMED
```

The operation is transactional.

------------------------------------------------------------------------

## Cancelling a Draft

``` text
DRAFT
  ↓
CANCELLED
```

Stock remains unchanged.

------------------------------------------------------------------------

## Cancelling a Confirmed Challan

``` text
CONFIRMED
  ↓
Restore stock
  ↓
Create IN movements
  ↓
CANCELLED
```

This produces a complete audit trail.

Example:

``` text
Initial stock
20

Challan confirmed
OUT 5
↓
15

Challan cancelled
IN 5
↓
20
```

------------------------------------------------------------------------

# 16. Dashboard

Endpoint:

``` http
GET /api/dashboard
```

The dashboard provides:

``` json
{
  "customers": {
    "total": 4,
    "active": 3,
    "leads": 1
  },
  "products": {
    "total": 9,
    "lowStock": 2
  },
  "inventory": {
    "totalStockUnits": 123
  },
  "challans": {
    "total": 4,
    "draft": 1,
    "confirmed": 2,
    "cancelled": 1
  }
}
```

The dashboard intentionally remains simple.

It is an operational dashboard, not a business-intelligence system.

------------------------------------------------------------------------

# 17. Database Design

The system uses PostgreSQL hosted through Supabase.

The core relational entities are:

``` text
User
Customer
FollowUp
Product
StockMovement
Challan
ChallanItem
```

------------------------------------------------------------------------

## User

Responsible for:

``` text
Authentication
Role
Audit ownership
```

Important fields conceptually include:

``` text
id
name
email
passwordHash
role
createdAt
updatedAt
```

Passwords are never stored in plaintext.

------------------------------------------------------------------------

## Customer

Stores CRM/customer master data.

Relationships:

``` text
Customer
 ├── FollowUps
 └── Challans
```

------------------------------------------------------------------------

## FollowUp

Stores customer follow-up activity.

Relationship:

``` text
Customer 1 ─── N FollowUps
```

------------------------------------------------------------------------

## Product

Stores product master data and current stock.

Relationships:

``` text
Product
 ├── StockMovements
 └── ChallanItems
```

------------------------------------------------------------------------

## StockMovement

Represents inventory history.

Relationship:

``` text
Product 1 ─── N StockMovements
User    1 ─── N StockMovements
```

------------------------------------------------------------------------

## Challan

Represents a sales transaction/document.

Relationships:

``` text
Customer 1 ─── N Challans
User     1 ─── N Challans
Challan  1 ─── N ChallanItems
```

------------------------------------------------------------------------

## ChallanItem

Stores:

``` text
productId
quantity
productNameSnapshot
skuSnapshot
unitPriceSnapshot
```

The snapshot fields preserve historical transaction information.

------------------------------------------------------------------------

# 18. Important Business Rules

## Rule 1 --- No negative stock

``` text
Stock cannot become negative.
```

------------------------------------------------------------------------

## Rule 2 --- Draft does not affect stock

``` text
Create challan
→ DRAFT
→ Stock unchanged
```

------------------------------------------------------------------------

## Rule 3 --- Confirmation affects stock

``` text
Confirm challan
→ Stock OUT
→ OUT movement
→ CONFIRMED
```

------------------------------------------------------------------------

## Rule 4 --- Insufficient stock rejects confirmation

``` text
Available = 2
Required = 5

→ Reject
→ No stock change
→ No OUT movement
→ Challan stays DRAFT
```

------------------------------------------------------------------------

## Rule 5 --- Cancellation reverses confirmed stock

``` text
Confirmed
→ OUT

Cancelled
→ IN
```

------------------------------------------------------------------------

## Rule 6 --- Cancellation is idempotent at the business level

A cancelled challan cannot be cancelled again.

This prevents duplicate stock restoration.

------------------------------------------------------------------------

## Rule 7 --- Snapshot historical product information

Old challans should not change merely because the Product master record
changes.

------------------------------------------------------------------------

## Rule 8 --- Audit stock changes

Every inventory modification must have a corresponding movement record.

------------------------------------------------------------------------

# 19. API Design

All endpoints use REST conventions.

Examples:

``` http
POST /api/auth/login
GET /api/customers
POST /api/customers
GET /api/customers/:id
PUT /api/customers/:id

POST /api/products
GET /api/products
GET /api/products/:id
PUT /api/products/:id

POST /api/inventory/movements
GET /api/inventory/movements

POST /api/challans
GET /api/challans
GET /api/challans/:id
POST /api/challans/:id/confirm
POST /api/challans/:id/cancel

GET /api/dashboard
```

The assignment explicitly expects clean REST APIs with validation,
status codes, error messages, pagination, and search/filtering where
needed. fileciteturn2file0

Complete API documentation is maintained separately in:

``` text
backend/API_DOCS.md
```

------------------------------------------------------------------------

# 20. Error Handling

Errors are centralized through:

``` text
src/middleware/error.middleware.js
```

The application uses appropriate HTTP status codes.

## 400

Bad request / validation / business-rule failure.

## 401

Authentication failure.

## 403

Authorization failure.

## 404

Resource not found.

## 409

Resource conflict where applicable.

## 500

Unexpected internal error.

Standard format:

``` json
{
  "success": false,
  "message": "Customer not found"
}
```

------------------------------------------------------------------------

# 21. Validation

Request validation is handled before controller execution.

Conceptually:

``` text
Request
  ↓
Validation Middleware
  ↓
Valid?
 ┌───────┴────────┐
 No               Yes
 ↓                 ↓
400              Controller
```

This prevents invalid data from reaching business logic.

Examples:

``` text
Required fields
String constraints
Email format
Positive quantities
Enum values
```

------------------------------------------------------------------------

# 22. Security

Security measures include:

## Password hashing

Passwords are stored as bcrypt hashes.

``` text
Password
   ↓
bcrypt
   ↓
passwordHash
```

------------------------------------------------------------------------

## JWT

Authenticated users receive a JWT.

Protected requests include:

``` http
Authorization: Bearer <token>
```

------------------------------------------------------------------------

## Helmet

Express security headers are enabled through Helmet.

------------------------------------------------------------------------

## CORS

CORS is configured through the frontend URL environment variable.

------------------------------------------------------------------------

## Environment variables

Secrets are not committed to Git.

Sensitive values include:

``` text
DATABASE_URL
DIRECT_URL
JWT_SECRET
```

------------------------------------------------------------------------

# 23. Environment Variables

Typical local environment:

``` env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

PORT=5000
NODE_ENV=development

JWT_SECRET="your-long-random-secret"
JWT_EXPIRES_IN="1d"

FRONTEND_URL="http://localhost:3000"
```

For testing, use a dedicated test database rather than production data.

Example:

``` env
TEST_DATABASE_URL="..."
TEST_DIRECT_URL="..."
TEST_JWT_SECRET="..."
```

------------------------------------------------------------------------

## Security rule

Never commit:

``` text
.env
```

Never hardcode:

``` text
DATABASE_URL
DIRECT_URL
JWT_SECRET
```

Never place production secrets inside a Dockerfile or GitHub Actions
YAML.

------------------------------------------------------------------------

# 24. Local Development

## Prerequisites

Install:

-   Node.js 22
-   npm
-   Git
-   PostgreSQL-compatible database / Supabase
-   Docker (optional but recommended)

------------------------------------------------------------------------

## Clone

``` bash
git clone <YOUR_REPOSITORY_URL>
cd fundsroom-erp/backend
```

------------------------------------------------------------------------

## Install

``` bash
npm install
```

------------------------------------------------------------------------

## Configure environment

Create:

``` text
backend/.env
```

Add the required variables.

------------------------------------------------------------------------

## Generate Prisma Client

``` bash
npx prisma generate
```

------------------------------------------------------------------------

## Inspect database

For an existing Supabase database:

``` bash
npx prisma db pull
```

------------------------------------------------------------------------

## Run development server

``` bash
npm run dev
```

Expected:

``` text
Database connected successfully
FundsRoom API running on http://localhost:5000
Environment: development
```

------------------------------------------------------------------------

## Health check

Open:

``` text
http://localhost:5000/api/health
```

------------------------------------------------------------------------

# 25. Database Setup

The database is PostgreSQL hosted through Supabase.

The Prisma schema is:

``` text
backend/prisma/schema.prisma
```

Prisma configuration is:

``` text
backend/prisma.config.ts
```

------------------------------------------------------------------------

## Important Prisma 7 behavior

Prisma 7 uses the Prisma config file for database configuration.

The project therefore keeps database connection configuration in:

``` text
prisma.config.ts
```

rather than putting a datasource URL directly in `schema.prisma`.

------------------------------------------------------------------------

## Typical workflow

``` bash
npx prisma generate
```

For an existing database:

``` bash
npx prisma db pull
```

For schema-driven migrations:

``` bash
npx prisma migrate dev
```

Use the migration workflow appropriate to the current database state.

------------------------------------------------------------------------

# 26. Automated Testing

The backend uses:

``` text
Jest
Supertest
```

Tests are located in:

``` text
backend/tests/
```

Current automated testing begins with:

``` text
Health Check
Authentication
```

The test suite is designed to expand to:

``` text
Customers
Products
Inventory
Challans
Dashboard
Authorization
Transaction rollback
```

------------------------------------------------------------------------

## Run tests

``` bash
npm test
```

The project uses:

``` bash
jest --runInBand
```

Running sequentially is useful because multiple tests interact with the
same relational database.

------------------------------------------------------------------------

## Important future test invariant

The most important integration workflow to automate is:

``` text
Create DRAFT
      ↓
Stock unchanged
      ↓
Confirm
      ↓
Stock decreases
      ↓
OUT movement created
      ↓
Cancel
      ↓
Stock restored
      ↓
IN movement created
```

Another critical test:

``` text
Multi-product challan
       ↓
One product insufficient
       ↓
Confirmation fails
       ↓
No product stock changes
       ↓
No OUT movements
       ↓
Challan remains DRAFT
```

------------------------------------------------------------------------

# 27. Docker

Docker is included as a bonus-oriented DevOps feature.

The case study explicitly lists Docker setup and GitHub Actions
deployment as bonus points. fileciteturn2file0

------------------------------------------------------------------------

## Docker structure

``` text
backend/
├── Dockerfile
└── .dockerignore
```

------------------------------------------------------------------------

## Dockerfile concept

The container:

``` text
Node 22 Alpine
      ↓
Install dependencies
      ↓
Copy Prisma schema/config
      ↓
Generate Prisma Client
      ↓
Copy application
      ↓
Expose 5000
      ↓
Start server
```

------------------------------------------------------------------------

## Build

From:

``` text
backend/
```

run:

``` bash
docker build -t fundsroom-backend .
```

------------------------------------------------------------------------

## Run

``` bash
docker run --env-file .env -p 5000:5000 fundsroom-backend
```

------------------------------------------------------------------------

## Health check

The container can use:

``` http
GET /api/health
```

as its health endpoint.

------------------------------------------------------------------------

## Secrets

The Docker image must not contain `.env`.

Environment variables are injected at runtime.

------------------------------------------------------------------------

# 28. CI/CD

GitHub Actions is used for automated backend CI/CD.

Workflow:

``` text
Git push
   ↓
GitHub Actions
   ↓
Checkout
   ↓
Setup Node.js
   ↓
npm ci
   ↓
Prisma generate
   ↓
npm test
   ↓
Build Docker image
   ↓
Push image
```

The intended image registry is:

``` text
GitHub Container Registry
```

------------------------------------------------------------------------

## Why tests run before Docker

Bad:

``` text
Push
 ↓
Docker image
 ↓
Tests
```

Better:

``` text
Push
 ↓
Tests
 ↓
PASS
 ↓
Docker build
 ↓
Push image
```

This prevents a broken commit from producing a deployable image.

------------------------------------------------------------------------

## GitHub Secrets

CI should use repository/environment secrets for:

``` text
TEST_DATABASE_URL
TEST_DIRECT_URL
TEST_JWT_SECRET
```

Never expose credentials in workflow source.

------------------------------------------------------------------------

# 29. Deployment Strategy

The assignment allows free hosting platforms such as:

### Frontend

-   Vercel
-   Netlify
-   Render Static Site
-   Similar platforms

### Backend

-   Render
-   Railway
-   Fly.io
-   Similar platforms

### Database

-   Supabase
-   Neon
-   Render PostgreSQL
-   Similar platforms

AWS is optional and provides bonus value. fileciteturn2file0

------------------------------------------------------------------------

## Recommended deployment architecture

``` text
                 Internet
                    │
                    ▼
              Frontend
          Vercel / similar
                    │
                    │ HTTPS
                    ▼
               Backend
           Render / Railway
                    │
                    │ PostgreSQL
                    ▼
               Supabase
```

Docker provides portability:

``` text
GitHub
  ↓
GitHub Actions
  ↓
Docker Image
  ↓
Container Hosting
```

------------------------------------------------------------------------

# 30. API Documentation

The complete API reference is maintained in:

**[`API_DOCS.md`](./API_DOCS.md)**

Use this document for endpoint-level details such as:

- Endpoint URLs
- HTTP methods
- Authentication requirements
- Roles and permissions
- Request payloads
- Response formats
- Query parameters
- Path parameters
- Error responses
- Business rules
- Challan and inventory behavior
- cURL examples

Keeping the detailed endpoint reference separate keeps this README focused on architecture, setup, implementation decisions, and deployment.

# 31. Git Workflow

The project uses meaningful commits.

Instead of:

``` text
update
changes
final
final2
fix
```

use commits that describe the feature:

``` text
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

------------------------------------------------------------------------

# 32. Suggested Commit History

A clean history can look like:

``` text
chore: initialize backend project
feat: configure express application
feat: configure database connection
feat: implement authentication and roles
feat: implement customer management
feat: implement customer follow-ups
feat: implement product management
feat: implement inventory movements
feat: implement challan creation
feat: implement challan confirmation
feat: calculate challan totals
feat: implement challan cancellation
feat: add dashboard summary
test: add automated API testing
docs: add API documentation
ci: add backend CI/CD pipeline and Docker
```

The actual Git history should reflect the commits that were really made.

------------------------------------------------------------------------

# 33. End-to-End Business Flows

## Flow A --- Login

``` text
Employee
  ↓
POST /api/auth/login
  ↓
Validate request
  ↓
Find User
  ↓
Compare password
  ↓
Generate JWT
  ↓
Return token
```

------------------------------------------------------------------------

## Flow B --- Customer

``` text
Sales employee
  ↓
POST /api/customers
  ↓
Validation
  ↓
Customer service
  ↓
Prisma
  ↓
Supabase
```

------------------------------------------------------------------------

## Flow C --- Inventory

``` text
Warehouse
  ↓
POST /api/inventory/movements
  ↓
Validate movement
  ↓
Find product
  ↓
Check stock
  ↓
Update currentStock
  ↓
Create StockMovement
```

------------------------------------------------------------------------

## Flow D --- Sales Challan

``` text
Sales
  ↓
Create challan
  ↓
DRAFT
  ↓
Customer + products + snapshots
  ↓
Confirm
  ↓
Check stock
  ↓
Transaction
  ├── Reduce stock
  ├── Create OUT movements
  └── CONFIRMED
```

------------------------------------------------------------------------

## Flow E --- Cancellation

``` text
CONFIRMED challan
       ↓
Cancel
       ↓
Transaction
       ├── Restore stock
       ├── Create IN movements
       └── CANCELLED
```

------------------------------------------------------------------------

# 34. Known Limitations

This is intentionally a compact ERP/CRM case-study implementation rather
than a complete enterprise ERP.

Potential limitations include:

1.  No complete purchase-order module.
2.  No invoice generation workflow.
3.  No payment/accounting ledger.
4.  No advanced reporting engine.
5.  No real-time notifications.
6.  No advanced warehouse/bin management.
7.  No multi-warehouse stock transfer workflow.
8.  No advanced audit-log platform.
9.  No production-grade observability stack.
10. No complex distributed architecture.

These are outside the minimum required scope.

The case study itself emphasizes that the goal is not to build a huge
system. fileciteturn2file0

------------------------------------------------------------------------

# 35. Case-Study Requirement Mapping

  Assignment Requirement            Backend Implementation
  --------------------------------- ------------------------
  Node.js                           ✅
  Express.js                        ✅
  PostgreSQL                        ✅
  REST APIs                         ✅
  Authentication                    ✅ JWT
  Admin role                        ✅
  Sales role                        ✅
  Warehouse role                    ✅
  Accounts role                     ✅
  Customer management               ✅
  Customer search                   ✅
  Customer details                  ✅
  Follow-ups                        ✅
  Product management                ✅
  SKU                               ✅
  Unit price                        ✅
  Current stock                     ✅
  Minimum stock                     ✅
  Inventory movements               ✅
  IN / OUT                          ✅
  Created by                        ✅
  Timestamp                         ✅
  Sales challans                    ✅
  Automatic challan number          ✅
  Draft                             ✅
  Confirmed                         ✅
  Cancelled                         ✅
  Stock reduction                   ✅
  Negative stock prevention         ✅
  Proper insufficient-stock error   ✅
  Product snapshots                 ✅
  Validation                        ✅
  HTTP status codes                 ✅
  Error handling                    ✅
  Pagination                        ✅
  Search/filter                     ✅
  Environment variables             ✅
  README                            ✅
  Docker bonus                      ✅
  GitHub Actions bonus              ✅
  Postman/API documentation         ✅

The assignment also asks the submission to include repository details,
live URLs where applicable, test credentials, API documentation,
architecture explanation, and known limitations. fileciteturn2file0

------------------------------------------------------------------------

# 36. Future Improvements

If additional time were available, useful extensions would be:

## Purchase Orders

``` text
Supplier
   ↓
Purchase Order
   ↓
Goods Received
   ↓
Stock IN
```

## Invoices

``` text
Confirmed Challan
      ↓
Invoice
      ↓
Payment
```

## PDF Export

Generate:

``` text
Sales Challan PDF
Invoice PDF
```

The case study explicitly lists invoice PDF export as a bonus feature.
fileciteturn2file0

## Product Images

Upload product images to object storage such as AWS S3.

The case study lists AWS S3 product-image upload as a bonus feature.
fileciteturn2file0

## Notifications

Add:

``` text
Low stock
Follow-up due
Challan confirmed
```

## Advanced Audit Logs

Track:

``` text
Who
What
When
Old value
New value
```

## Observability

Add:

``` text
Structured logging
Request IDs
Metrics
Tracing
Error monitoring
```

------------------------------------------------------------------------

# Final Architecture Summary

The complete backend can be summarized as:

``` text
                         ┌───────────────────────┐
                         │       Frontend        │
                         │     React / Next.js   │
                         └───────────┬───────────┘
                                     │
                                  HTTPS
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │     Express API       │
                         └───────────┬───────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
              Authentication   Validation       Error Handler
                    │                │
                    └────────────────┘
                             │
                             ▼
                        Controllers
                             │
                             ▼
                         Services
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
          Customer        Product        Challan
              │              │              │
              │              ▼              │
              │          Inventory ◄────────┘
              │              │
              └──────────────┼──────────────┘
                             ▼
                           Prisma
                             │
                             ▼
                    Supabase PostgreSQL
```

The key business invariant is:

``` text
                    STOCK CONSISTENCY

       ┌─────────────────────────────────────┐
       │                                     │
       │  DRAFT → no stock change            │
       │                                     │
       │  CONFIRM → OUT movement + decrease  │
       │                                     │
       │  CANCEL → IN movement + restore    │
       │                                     │
       │  Insufficient stock → rollback      │
       │                                     │
       └─────────────────────────────────────┘
```

This is the core of the backend's business correctness.

------------------------------------------------------------------------

## Conclusion

The FundsRoom backend is intentionally designed as a **small,
maintainable, transactional ERP backend** rather than an over-engineered
enterprise platform.

The strongest parts of the implementation are:

-   Clear module separation
-   JWT authentication
-   Role-based authorization
-   PostgreSQL relational modeling
-   Prisma ORM
-   Zod validation
-   Inventory audit trail
-   Challan product snapshots
-   Transaction-safe stock operations
-   Automated testing
-   Docker
-   GitHub Actions CI/CD
-   Detailed API documentation
-   Meaningful Git history

The implementation directly addresses the core case-study requirements
while keeping the architecture understandable enough to explain during
an interview.

------------------------------------------------------------------------

**Project:** FundsRoom ERP + CRM Operations Portal\
**Backend:** Node.js + Express.js + JavaScript\
**Database:** Supabase PostgreSQL\
**ORM:** Prisma\
**Authentication:** JWT\
**Testing:** Jest + Supertest\
**Containerization:** Docker\
**CI/CD:** GitHub Actions
