FundsRoom Backend Progress

Project Stack

Node.js

Express.js

JavaScript

PostgreSQL

Supabase

Prisma 7

JWT

bcrypt

Zod

Helmet

CORS

Nodemon

1. Backend Initialization

Initialized the backend project with Node.js and Express.

Basic structure:

backend/
├── src/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ ├── validators/
│ ├── app.js
│ └── server.js
├── prisma/
├── .env
├── prisma.config.ts
├── package.json
└── README.md

Development server:

npm run dev

2. Environment Configuration

Configured:

PORT=5000
NODE_ENV=development
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:3000

.env is not committed to Git.

3. Supabase PostgreSQL + Prisma

Connected the backend to Supabase PostgreSQL using Prisma 7.

Prisma 7 configuration uses prisma.config.ts.

prisma.config.ts

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
schema: "prisma/schema.prisma",

migrations: {
path: "prisma/migrations",
},

datasource: {
url: env("DIRECT_URL"),
},
});

prisma/schema.prisma

The Prisma client uses:

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
}

The Supabase database connection was successfully verified.

4. Database Schema

Created the core FundsRoom relational schema.

Models:

User
Customer
FollowUp
Product
StockMovement
Challan
ChallanItem

Enums:

UserRole

- ADMIN
- SALES
- WAREHOUSE
- ACCOUNTS

CustomerType

- RETAIL
- WHOLESALE
- DISTRIBUTOR

CustomerStatus

- LEAD
- ACTIVE
- INACTIVE

StockMovementType

- IN
- OUT

ChallanStatus

- DRAFT
- CONFIRMED
- CANCELLED

Important relationships:

User
├── Customer
├── FollowUp
├── StockMovement
└── Challan

Customer
├── FollowUp
└── Challan

Product
├── StockMovement
└── ChallanItem

Challan
└── ChallanItem

ChallanItem stores product snapshots:

productNameSnapshot
skuSnapshot
unitPriceSnapshot

This preserves historical challan information even if the productchanges later.

5. Database Migration

Created the initial Prisma migration:

npx prisma migrate dev --name init

The schema was successfully created in Supabase.

Prisma Studio can be used with:

npx prisma studio

6. Database Seed

Created:

prisma/seed.js

Seeded:

1 Admin user

1 Sales user

1 Warehouse user

1 Accounts user

Multiple customers

8 products

Initial stock movements

Customer follow-ups

Test users:

Role Email Password

Admin admin@fundsroom.local Admin@123Sales sales@fundsroom.local Sales@123Warehouse warehouse@fundsroom.local Warehouse@123Accounts accounts@fundsroom.local Accounts@123

These are development/test credentials only.

7. Prisma Database Configuration

src/config/database.js

Configured Prisma 7 with the PostgreSQL adapter.

The application uses:

Express
↓
Prisma Client
↓
@prisma/adapter-pg
↓
Supabase PostgreSQL

The backend successfully connects to the database during startup.

8. Express Application

Configured:

Helmet

CORS

JSON parsing

URL encoded body parsing

API routes

Health endpoint

Global error handler

Health endpoint:

GET /api/health

Response:

{
"success": true,
"message": "FundsRoom API is running",
"environment": "development"
}

9. JWT Authentication

Implemented:

POST /api/auth/login

Login flow:

Email + Password
↓
Find User
↓
bcrypt.compare()
↓
Generate JWT
↓
Return token + user information

JWT contains:

{
"userId": "...",
"role": "SALES"
}

Passwords are never stored in plaintext.

10. Authentication Utilities

Created:

src/utils/password.js
src/utils/jwt.js

Password utility handles:

hashPassword()
comparePassword()

JWT utility handles:

generateToken()
verifyToken()

11. Authentication Middleware

Created:

src/middleware/auth.middleware.js

Implemented:

authenticateToken

It:

Reads the Authorization header.

Requires Bearer <token>.

Verifies the JWT.

Checks expiration.

Places authenticated user information in:

req.user

Example:

req.user = {
id: decoded.userId,
role: decoded.role
};

12. Role-Based Authorization

Created:

src/middleware/role.middleware.js

Implemented:

requireRole(...)

Example:

requireRole("ADMIN", "SALES")

Authorization behavior:

401 = authentication missing/invalid

403 = authenticated but not authorized

Current general permission approach:

Module ADMIN SALES WAREHOUSE ACCOUNTS

Customers - Read Yes Yes Yes YesCustomers - Create/Update Yes Yes No NoFollow-ups Yes Yes No NoProducts Planned Planned Planned PlannedInventory Planned Planned Planned PlannedChallans Planned Planned Planned PlannedDashboard Planned Planned Planned Planned

The exact permissions for remaining modules will be implemented as thosemodules are built.

13. Customer CRM - Create

Implemented:

POST /api/customers

Only:

ADMIN
SALES

can create customers.

Customer creation uses the authenticated user's ID rather than acceptingcreatedById from the frontend.

Customer fields include:

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
createdById

14. Customer CRM - List

Implemented:

GET /api/customers

Features:

Pagination

Search

Status filter

Type filter

Examples:

GET /api/customers
GET /api/customers?page=1&limit=10
GET /api/customers?search=electronics
GET /api/customers?status=ACTIVE
GET /api/customers?type=WHOLESALE

Search covers:

name
mobile
email
businessName

Response includes:

{
"success": true,
"data": [],
"pagination": {
"page": 1,
"limit": 10,
"total": 20,
"totalPages": 2
}
}

Pagination limits are capped at 100 records per request.

15. Customer CRM - Details

Implemented:

GET /api/customers/:id

The response includes:

Customer information

Follow-ups

Related challans

Nonexistent customers return:

404 Customer not found

16. Customer CRM - Update

Implemented:

PUT /api/customers/:id

Only:

ADMIN
SALES

can update customers.

Partial updates are supported.

Example:

{
"status": "ACTIVE"
}

or:

{
"mobile": "9999999999",
"notes": "Customer confirmed order."
}

An empty update body is rejected.

17. Validation

Zod is being used for request validation.

Created:

src/middleware/validation.middleware.js
src/validators/auth.validator.js
src/validators/customer.validator.js

Validation failures use:

400 Bad Request

with a consistent response structure:

{
"success": false,
"message": "Validation failed",
"errors": []
}

18. Error Handling

Created:

src/middleware/error.middleware.js

Controllers pass errors to:

next(error)

The global error middleware handles the response.

Common statuses implemented so far:

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error

19. Current API Endpoints

Authentication

POST /api/auth/login

Health

GET /api/health

Customers

POST /api/customers
GET /api/customers
GET /api/customers/:id
PUT /api/customers/:id

20. Current Architecture

HTTP Request
↓
Express Route
↓
Authentication Middleware
↓
Role Middleware
↓
Validation Middleware
↓
Controller
↓
Service
↓
Prisma
↓
Supabase PostgreSQL

The project intentionally avoids unnecessary complexity.

We are using:

Routes
Controllers
Services
Middleware
Validators
Prisma

rather than introducing unnecessary repositories, factories, dependencyinjection containers, or additional frameworks.

21. Git Milestones Completed

Commits completed so far:

chore: initialize backend project

feat: configure express server and environment

feat: add core relational database schema

feat: add database seed data

feat: implement jwt authentication

feat: implement jwt authentication and role authorization

feat: implement customer creation

feat: add customer listing search and pagination

feat: add customer details and update

22. Remaining Backend Work

Customer CRM

POST /api/customers/:id/follow-ups
GET /api/customers/:id/follow-ups

Products

POST /api/products
GET /api/products
GET /api/products/:id
PUT /api/products/:id

With:

search
pagination
category filter
low-stock filter

Inventory

POST /api/inventory/movements
GET /api/inventory/movements
GET /api/inventory/movements/:id
GET /api/products/:id/stock-movements

Business rule:

Stock can never become negative.

Sales Challans

POST /api/challans
GET /api/challans
GET /api/challans/:id
POST /api/challans/:id/confirm
POST /api/challans/:id/cancel

Important requirements:

Draft does not affect stock.

Confirm:

- validate stock
- reduce stock
- create OUT movements
- mark challan CONFIRMED

Failure:

- rollback all changes

Cancel:

- restore stock where required
- create IN movements
- mark challan CANCELLED

Dashboard

GET /api/dashboard

Will provide basic:

Customer counts

Product counts

Low-stock count

Challan counts

Finalization

Testing
API documentation
Postman collection
README
Architecture documentation
Known limitations
Deployment
