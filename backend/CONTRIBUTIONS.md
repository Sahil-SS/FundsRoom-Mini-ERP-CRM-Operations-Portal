# Contributing to FundsRoom ERP Backend

This document explains how a developer can set up the FundsRoom ERP
backend on a new machine, run it locally, work on the codebase, test
changes, build the Docker image, and understand the basic contribution
workflow.

The goal is to make the repository runnable without requiring prior
knowledge of the project.

------------------------------------------------------------------------

## Table of Contents

-   [1. Before You Start](#1-before-you-start)
-   [2. Clone the Repository](#2-clone-the-repository)
-   [3. Backend Directory](#3-backend-directory)
-   [4. Required Software](#4-required-software)
-   [5. Install Dependencies](#5-install-dependencies)
-   [6. Environment Variables](#6-environment-variables)
-   [7. Database Setup](#7-database-setup)
-   [8. Prisma Setup](#8-prisma-setup)
-   [9. Start the Backend](#9-start-the-backend)
-   [10. Verify the API](#10-verify-the-api)
-   [11. Run Automated Tests](#11-run-automated-tests)
-   [12. Useful npm Commands](#12-useful-npm-commands)
-   [13. Docker Setup](#13-docker-setup)
-   [14. GitHub Actions / CI](#14-github-actions--ci)
-   [15. Making Code Changes](#15-making-code-changes)
-   [16. Adding a New API Endpoint](#16-adding-a-new-api-endpoint)
-   [17. Database Changes](#17-database-changes)
-   [18. API Documentation](#18-api-documentation)
-   [19. Commit Convention](#19-commit-convention)
-   [20. Pull Request Process](#20-pull-request-process)
-   [21. Troubleshooting](#21-troubleshooting)
-   [22. Quick Start](#22-quick-start)

------------------------------------------------------------------------

# 1. Before You Start

FundsRoom is a Node.js + Express backend using:

``` text
Node.js
Express.js
JavaScript
PostgreSQL
Supabase
Prisma
JWT
Zod
Jest
Supertest
Docker
GitHub Actions
```

The backend is designed as a modular REST API.

You should have access to:

-   The GitHub repository
-   A Supabase PostgreSQL database
-   The required environment variables
-   Docker, if you want to run the container locally

------------------------------------------------------------------------

# 2. Clone the Repository

Clone the repository:

``` bash
git clone <REPOSITORY_URL>
```

Move into the project:

``` bash
cd fundsroom-erp
```

------------------------------------------------------------------------

# 3. Backend Directory

Move into the backend:

``` bash
cd backend
```

All backend commands in this document are expected to be run from:

``` text
fundsroom-erp/backend
```

unless explicitly stated otherwise.

------------------------------------------------------------------------

# 4. Required Software

## Node.js

Use Node.js 22 or a compatible version supported by the project.

Check:

``` bash
node -v
```

Example:

``` text
v22.x.x
```

Check npm:

``` bash
npm -v
```

------------------------------------------------------------------------

## Git

Check:

``` bash
git --version
```

------------------------------------------------------------------------

## Docker

Docker is optional for normal local development but required if you want
to test the containerized application.

Check:

``` bash
docker --version
```

------------------------------------------------------------------------

# 5. Install Dependencies

Inside `backend/` run:

``` bash
npm install
```

For a clean, reproducible installation using the lock file:

``` bash
npm ci
```

Prefer `npm ci` in CI/CD and when you want the exact dependency versions
recorded in `package-lock.json`.

------------------------------------------------------------------------

# 6. Environment Variables

Create a local environment file:

``` text
backend/.env
```

Do not commit this file.

A typical environment contains:

``` env
DATABASE_URL="YOUR_SUPABASE_DATABASE_URL"
DIRECT_URL="YOUR_SUPABASE_DIRECT_DATABASE_URL"

PORT=5000
NODE_ENV=development

JWT_SECRET="YOUR_LONG_RANDOM_SECRET"
JWT_EXPIRES_IN="1d"

FRONTEND_URL="http://localhost:3000"
```

For automated tests, use a dedicated test database rather than
production data.

Example CI/test variables:

``` text
TEST_DATABASE_URL
TEST_DIRECT_URL
TEST_JWT_SECRET
```

### Important

Never commit:

``` text
.env
```

------------------------------------------------------------------------

# 7. Database Setup

FundsRoom uses PostgreSQL through Supabase.

You need a working database connection before running database-dependent
APIs.

The important connection variables are:

``` env
DATABASE_URL="..."
DIRECT_URL="..."
```

After configuring `.env`, verify that Prisma can read the configuration.

------------------------------------------------------------------------

# 8. Prisma Setup

## Generate Prisma Client

Run:

``` bash
npx prisma generate
```

This generates the Prisma Client used by the backend.

------------------------------------------------------------------------

## Pull an Existing Database

If the Supabase database already contains the schema:

``` bash
npx prisma db pull
```

This introspects the database and updates:

``` text
prisma/schema.prisma
```

Do not run this blindly if another developer has local schema changes
that have not been committed.

------------------------------------------------------------------------

## Prisma Migrations

If the project is using Prisma migrations for schema changes:

``` bash
npx prisma migrate dev
```

Use migrations carefully when working with a shared database.

For production deployments, do not casually run destructive development
commands against the production database.

------------------------------------------------------------------------

# 9. Start the Backend

## Development

Run:

``` bash
npm run dev
```

The development server uses Nodemon and automatically restarts when
source files change.

Expected output:

``` text
Database connected successfully
FundsRoom API running on http://localhost:5000
Environment: development
```

------------------------------------------------------------------------

## Production-style local start

Run:

``` bash
npm start
```

This starts:

``` text
node src/server.js
```

------------------------------------------------------------------------

# 10. Verify the API

The backend health endpoint is:

``` http
GET /api/health
```

Open:

``` text
http://localhost:5000/api/health
```

Expected response:

``` json
{
  "success": true,
  "message": "FundsRoom API is running",
  "environment": "development"
}
```

If this works, the Express application is running.

If the console also reports:

``` text
Database connected successfully
```

the database connection is working as well.

------------------------------------------------------------------------

# 11. Run Automated Tests

Run the full Jest suite:

``` bash
npm test
```

The current project uses:

``` text
Jest
Supertest
```

The test command is configured to run sequentially:

``` text
jest --runInBand
```

This is useful because integration tests can interact with the same
database.

A successful run should report:

``` text
Test Suites: ... passed
Tests:       ... passed
```

Do not push a feature with failing tests unless the failure is
intentional and documented.

------------------------------------------------------------------------

# 12. Useful npm Commands

  Command                    Purpose
  -------------------------- ------------------------------------
  `npm install`              Install dependencies
  `npm ci`                   Clean dependency installation
  `npm run dev`              Start development server
  `npm start`                Start backend normally
  `npm test`                 Run automated tests
  `npx prisma generate`      Generate Prisma Client
  `npx prisma db pull`       Introspect existing database
  `npx prisma migrate dev`   Create/apply development migration

------------------------------------------------------------------------

# 13. Docker Setup

Docker is included so the backend can run consistently outside a
developer's local Node environment.

## Build the image

From:

``` text
backend/
```

run:

``` bash
docker build -t fundsroom-backend .
```

------------------------------------------------------------------------

## Verify the image

``` bash
docker images
```

Look for:

``` text
fundsroom-backend
```

------------------------------------------------------------------------

## Run the container

Use your local environment variables at runtime:

``` bash
docker run --env-file .env -p 5000:5000 fundsroom-backend
```

Do not copy `.env` into the Docker image.

------------------------------------------------------------------------

## Test the container

Open:

``` text
http://localhost:5000/api/health
```

Expected:

``` json
{
  "success": true,
  "message": "FundsRoom API is running",
  "environment": "development"
}
```

------------------------------------------------------------------------

## Stop the container

Find the running container:

``` bash
docker ps
```

Then:

``` bash
docker stop <CONTAINER_ID>
```

------------------------------------------------------------------------

# 14. GitHub Actions / CI

The repository contains:

``` text
.github/workflows/backend-ci-cd.yml
```

The CI/CD pipeline is designed to:

``` text
Push / Pull Request
        ↓
Checkout
        ↓
Install dependencies
        ↓
Prisma generate
        ↓
Run tests
        ↓
Build Docker image
        ↓
Push image on main
```

The Docker build should happen only after the test job succeeds.

------------------------------------------------------------------------

## GitHub Secrets

The workflow may require:

``` text
TEST_DATABASE_URL
TEST_DIRECT_URL
TEST_JWT_SECRET
```

These must be configured in:

``` text
GitHub
→ Repository
→ Settings
→ Secrets and variables
→ Actions
```

Do not place them directly inside the workflow file.

------------------------------------------------------------------------

# 15. Making Code Changes

Before making a change:

``` bash
git pull origin main
```

Create a feature branch:

``` bash
git checkout -b feature/customer-search
```

Make the changes.

Run:

``` bash
npm test
```

If the change affects Prisma:

``` bash
npx prisma generate
```

If the change affects the database schema, follow the project's
migration process.

Then inspect the changes:

``` bash
git status
```

and:

``` bash
git diff
```

------------------------------------------------------------------------

# 16. Adding a New API Endpoint

The project follows a layered structure.

For a new feature, normally work through:

``` text
validator
   ↓
route
   ↓
middleware
   ↓
controller
   ↓
service
   ↓
Prisma/database
```

Example:

``` text
New customer endpoint

validators/customer.validator.js
          ↓
routes/customer.routes.js
          ↓
controllers/customer.controller.js
          ↓
services/customer.service.js
          ↓
Prisma
```

Avoid putting large business rules directly inside route files.

Controllers should remain thin.

Services should contain business logic.

------------------------------------------------------------------------

# 17. Database Changes

When changing the database:

1.  Update the Prisma schema.
2.  Generate Prisma Client.
3.  Create/apply the appropriate migration if the project is using
    migrations.
4.  Update affected services.
5.  Update validators.
6.  Update tests.
7.  Update API documentation if the public API changed.

Typical commands:

``` bash
npx prisma generate
```

and, when appropriate:

``` bash
npx prisma migrate dev
```

For an existing externally managed schema:

``` bash
npx prisma db pull
```

Use only the workflow appropriate to the current database setup.

------------------------------------------------------------------------

## Important inventory rule

Changes involving:

``` text
Product.currentStock
StockMovement
Challan
ChallanItem
```

must preserve the inventory invariants.

Never introduce a change that allows:

``` text
currentStock < 0
```

or causes a challan confirmation to partially update stock.

------------------------------------------------------------------------

# 18. API Documentation

The detailed API reference is maintained separately:

``` text
backend/API_DOCS.md
```

Read it before adding or modifying public endpoints.

It contains:

-   Endpoint URLs
-   HTTP methods
-   Authentication
-   Roles
-   Payloads
-   Query parameters
-   Responses
-   Error formats
-   Business rules
-   Challan lifecycle
-   Inventory behavior
-   cURL examples

If an API changes, update:

``` text
API_DOCS.md
```

in the same change.

------------------------------------------------------------------------

# 19. Commit Convention

Use meaningful commit messages.

Examples:

``` bash
git commit -m "feat: add customer search"
```

``` bash
git commit -m "fix: prevent negative inventory"
```

``` bash
git commit -m "test: add challan confirmation tests"
```

``` bash
git commit -m "docs: update API documentation"
```

``` bash
git commit -m "ci: update backend pipeline"
```

Common prefixes:

``` text
feat     New functionality
fix      Bug fix
test     Tests
docs     Documentation
refactor Code restructuring
chore    Maintenance/configuration
ci       CI/CD changes
```

------------------------------------------------------------------------

# 20. Pull Request Process

Before opening a PR:

``` bash
git pull origin main
npm test
```

If Docker-related changes were made:

``` bash
docker build -t fundsroom-backend .
```

Check:

``` bash
git status
```

Then push:

``` bash
git push -u origin feature/your-feature-name
```

Open a Pull Request.

The PR description should explain:

``` text
What changed?
Why was it changed?
How was it tested?
Does it affect the database?
Does it change the API?
```

------------------------------------------------------------------------

# 21. Troubleshooting

## `npm install` fails

Try:

``` bash
npm cache verify
```

Then:

``` bash
npm ci
```

If the lock file is intentionally being regenerated:

``` bash
npm install
```

------------------------------------------------------------------------

## Database authentication fails

Check:

``` env
DATABASE_URL
DIRECT_URL
```

Make sure:

-   Username is correct.
-   Password is correct.
-   Supabase host is correct.
-   Port is correct.
-   Database name is correct.
-   Special characters in passwords are URL-encoded when required by the
    connection string.

Do not paste database credentials into GitHub issues or chat.

------------------------------------------------------------------------

## Prisma Client error

Run:

``` bash
npx prisma generate
```

If the Prisma schema changed, regenerate the client again.

------------------------------------------------------------------------

## Prisma database is empty

If:

``` bash
npx prisma db pull
```

reports that the database is empty, verify that the Supabase project
actually contains the required tables.

An empty database cannot be introspected into application models.

------------------------------------------------------------------------

## Docker cannot find the image

If:

``` bash
docker run --env-file .env -p 5000:5000 fundsroom-backend
```

says:

``` text
Unable to find image 'fundsroom-backend:latest'
```

build it first:

``` bash
docker build -t fundsroom-backend .
```

Then run it again.

------------------------------------------------------------------------

## Docker Prisma configuration error

Prisma configuration is loaded during commands such as:

``` bash
npx prisma generate
```

The Docker image intentionally does not contain `.env`.

Therefore Prisma configuration should not require an unavailable
environment variable merely to generate the client.

The runtime container receives environment variables through:

``` bash
docker run --env-file .env ...
```

Do not bake production credentials into the Dockerfile.

------------------------------------------------------------------------

## Port already in use

If port `5000` is occupied:

``` bash
netstat -ano | findstr :5000
```

On Windows, stop the process using the port or use another host port:

``` bash
docker run --env-file .env -p 5001:5000 fundsroom-backend
```

The application still listens on:

``` text
5000
```

inside the container.

------------------------------------------------------------------------

## Tests fail because of database state

Integration tests may depend on database records.

Use a dedicated test database.

Do not point automated tests at production data.

------------------------------------------------------------------------

# 22. Quick Start

For a developer who only wants to get the project running:

## Step 1 --- Clone

``` bash
git clone <REPOSITORY_URL>
cd fundsroom-erp/backend
```

## Step 2 --- Install

``` bash
npm ci
```

## Step 3 --- Create `.env`

``` env
DATABASE_URL="YOUR_DATABASE_URL"
DIRECT_URL="YOUR_DIRECT_URL"

PORT=5000
NODE_ENV=development

JWT_SECRET="YOUR_SECRET"
JWT_EXPIRES_IN="1d"

FRONTEND_URL="http://localhost:3000"
```

## Step 4 --- Generate Prisma Client

``` bash
npx prisma generate
```

## Step 5 --- Start

``` bash
npm run dev
```

## Step 6 --- Verify

Open:

``` text
http://localhost:5000/api/health
```

## Step 7 --- Test

``` bash
npm test
```

## Step 8 --- Optional Docker

``` bash
docker build -t fundsroom-backend .
```

Then:

``` bash
docker run --env-file .env -p 5000:5000 fundsroom-backend
```

------------------------------------------------------------------------

# Development Principle

When contributing to FundsRoom, prioritize:

``` text
Correct business logic
        ↓
Data consistency
        ↓
Validation
        ↓
Security
        ↓
Tests
        ↓
Documentation
        ↓
Deployment compatibility
```

Avoid adding complexity unless it solves an actual requirement.

For the ERP's most important workflow, always preserve:

``` text
DRAFT
  ↓
CONFIRM
  ↓
Stock OUT
  ↓
CONFIRMED
  ↓
CANCEL
  ↓
Stock IN
  ↓
CANCELLED
```

and:

``` text
Insufficient stock
       ↓
Confirmation rejected
       ↓
No partial stock update
       ↓
Challan remains DRAFT
```

These are core business invariants of the backend.
