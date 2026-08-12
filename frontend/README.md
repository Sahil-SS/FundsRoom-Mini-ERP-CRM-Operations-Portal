# FundsRoom --- Mini ERP + CRM Operations Portal

A responsive, role-aware ERP/CRM operations frontend for a
wholesale/distribution business.

The application provides a single admin-style interface for managing
customers, products, inventory movements, sales challans, follow-ups,
and operational dashboard information. It integrates with a RESTful
Node.js/Express backend using JWT authentication and PostgreSQL.

> **Assignment:** Full Stack Developer Case Study --- Mini ERP + CRM
> Operations Portal\
> **Frontend:** Next.js / React / TypeScript / Tailwind CSS /
> shadcn-style UI\
> **Backend:** Node.js / Express / TypeScript / REST API\
> **Database:** PostgreSQL\
> **Authentication:** JWT + role-based authorization

------------------------------------------------------------------------

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Case Study Requirements](#case-study-requirements)
3.  [Features](#features)
4.  [Roles and Permissions](#roles-and-permissions)
5.  [Technology Stack](#technology-stack)
6.  [Architecture](#architecture)
7.  [Application Flow](#application-flow)
8.  [Frontend Folder Structure](#frontend-folder-structure)
9.  [Important Files](#important-files)
10. [Backend Integration](#backend-integration)
11. [API Integration](#api-integration)
12. [Authentication](#authentication)
13. [Customer CRM](#customer-crm)
14. [Products](#products)
15. [Inventory](#inventory)
16. [Sales Challans](#sales-challans)
17. [Challan PDF Export](#challan-pdf-export)
18. [Dashboard](#dashboard)
19. [Validation and Error Handling](#validation-and-error-handling)
20. [Responsive UI](#responsive-ui)
21. [Environment Variables](#environment-variables)
22. [Local Development](#local-development)
23. [Production Build](#production-build)
24. [Deployment](#deployment)
25. [Testing Checklist](#testing-checklist)
26. [Git Workflow](#git-workflow)
27. [Documentation and Submission](#documentation-and-submission)
28. [Known Limitations](#known-limitations)
29. [Future Improvements](#future-improvements)
30. [Project Status](#project-status)

------------------------------------------------------------------------

# Project Overview

FundsRoom is a Mini ERP + CRM Operations Portal designed for a
wholesale/distribution business.

The frontend provides an employee-facing interface for:

-   Authentication
-   Role-based access
-   Customer CRM
-   Customer follow-ups
-   Product management
-   Inventory management
-   Inventory movement history
-   Sales challans
-   Challan lifecycle management
-   Stock-aware challan confirmation
-   Challan cancellation and stock restoration
-   Challan PDF export
-   Operational dashboard
-   Low-stock visibility
-   Responsive administration

The application is designed around real business workflows instead of
being a collection of disconnected CRUD screens.

------------------------------------------------------------------------

# Case Study Requirements

The original case study asks for a small ERP/CRM system for a
wholesale/distribution company.

The required business areas are:

-   Authentication and roles
-   Customer CRM
-   Product and inventory management
-   Sales challans
-   Clean REST APIs
-   Validation and error handling
-   Pagination/search/filtering where appropriate
-   Responsive admin-style frontend
-   Deployment documentation
-   Environment variable management
-   README and architecture documentation
-   Proper Git commits

The case study specifies four roles:

-   Admin
-   Sales
-   Warehouse
-   Accounts

The frontend implements the required operational modules and consumes
the REST APIs exposed by the backend.

The assignment also lists PDF export, Docker, GitHub Actions, and AWS S3
product images as bonus features. Challan PDF export is included in this
implementation.

------------------------------------------------------------------------

# Features

## Authentication

-   JWT-based login
-   Persistent authenticated session
-   Current-user state
-   Role-aware frontend navigation
-   Protected dashboard routes
-   Logout support
-   Unauthorized action prevention at the UI level

The backend remains the authoritative security boundary.

------------------------------------------------------------------------

## Customer CRM

The customer module supports:

-   Customer listing
-   Search
-   Pagination
-   Customer creation
-   Customer editing
-   Customer details
-   Customer status
-   Customer type
-   Follow-up notes
-   Follow-up history
-   Role-aware create/edit actions
-   Loading states
-   Empty states
-   API error states

Customer information includes the fields required by the case study:

-   Customer name
-   Mobile number
-   Email
-   Business name
-   GST number
-   Customer type
-   Address
-   Status
-   Follow-up date
-   Notes

Supported customer types include:

-   Retail
-   Wholesale
-   Distributor

Supported statuses include:

-   Lead
-   Active
-   Inactive

------------------------------------------------------------------------

## Product Management

The product section supports:

-   Product listing
-   Search/filtering
-   Pagination
-   Product creation
-   Product editing
-   SKU/code
-   Category
-   Unit price
-   Current stock
-   Minimum stock threshold
-   Warehouse/location
-   Low-stock visibility

------------------------------------------------------------------------

## Inventory Management

The inventory module supports:

-   Current stock visibility
-   Inventory movement history
-   IN movements
-   OUT movements
-   Product filtering
-   Movement filtering
-   Pagination
-   Quantity changes
-   Movement reason
-   Created-by information
-   Timestamp visibility

Inventory movement records are associated with business operations such
as stock receipts and sales dispatches.

------------------------------------------------------------------------

## Sales Challans

The challan module supports the complete lifecycle:

``` text
Create Draft
     ↓
Review
     ↓
Confirm
     ↓
Stock Deduction
```

or:

``` text
Draft
  ↓
Cancel
```

and:

``` text
Confirmed
    ↓
Cancel
    ↓
Stock Restoration
```

Features include:

-   Challan listing
-   Search/filtering
-   Pagination
-   Customer selection
-   Multiple products
-   Quantity per product
-   Automatic challan number
-   Draft status
-   Confirmed status
-   Cancelled status
-   Customer information
-   Product snapshot information
-   Total quantity
-   Total amount
-   Created-by information
-   Created date
-   Confirmation workflow
-   Cancellation workflow
-   Stock-aware confirmation
-   PDF export

------------------------------------------------------------------------

# Roles and Permissions

The system uses four business roles.

  Role        Primary Responsibility
  ----------- ---------------------------------------
  ADMIN       Full operational access
  SALES       Customers, follow-ups, sales challans
  WAREHOUSE   Products and inventory operations
  ACCOUNTS    Financial/operational visibility

Frontend permissions are used to control which actions are displayed.

For example:

``` ts
const canEdit =
  user?.role === "ADMIN" ||
  user?.role === "SALES";
```

The frontend should never be considered the sole security mechanism.
Every protected API operation must also be authorized by the backend.

------------------------------------------------------------------------

# Technology Stack

## Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   shadcn-style UI components
-   Lucide React icons
-   Axios
-   TanStack Query / React Query
-   jsPDF
-   jspdf-autotable

## Backend

-   Node.js
-   TypeScript
-   Express.js
-   REST APIs
-   JWT authentication

## Database

-   PostgreSQL

## Deployment

The assignment permits free deployment providers such as:

-   Vercel
-   Netlify
-   Render
-   Railway
-   Fly.io
-   Supabase
-   Neon

AWS deployment is optional and considered a bonus.

------------------------------------------------------------------------

# Architecture

The frontend follows a modular Next.js architecture.

``` text
Browser
   |
   v
Next.js / React UI
   |
   +----------------------+
   |                      |
   v                      v
Hooks                  UI Components
   |                      |
   +----------+-----------+
              |
              v
        API Client Layer
              |
              v
       REST Backend APIs
              |
              v
          PostgreSQL
```

Authentication flow:

``` text
User
 |
 | Login credentials
 v
POST /auth/login
 |
 v
Backend validates user
 |
 v
JWT returned
 |
 v
Frontend stores authenticated state
 |
 v
Protected API requests
 |
 | Authorization: Bearer <token>
 v
Backend
```

------------------------------------------------------------------------

# Application Flow

## Login

``` text
/login
   |
   v
LoginForm
   |
   v
Authentication hook
   |
   v
POST /auth/login
   |
   v
Authenticated user
   |
   v
/dashboard
```

## Customer Flow

``` text
Customers
   |
   +--> Search
   |
   +--> Create
   |
   +--> Edit
   |
   +--> Details
           |
           +--> Follow-up history
           |
           +--> Add follow-up
```

## Inventory Flow

``` text
Inventory
   |
   +--> Current stock
   |
   +--> Movement history
   |
   +--> IN
   |
   +--> OUT
```

## Challan Flow

``` text
Challan List
     |
     +--> Create Draft
     |       |
     |       +--> Select customer
     |       +--> Select products
     |       +--> Add quantities
     |
     +--> Details
             |
             +--> Download PDF
             |
             +--> Confirm
             |      |
             |      +--> Backend checks stock
             |      +--> Deduct stock
             |      +--> Create OUT movement
             |
             +--> Cancel
                    |
                    +--> Draft cancellation
                    |
                    +--> Confirmed cancellation
                           |
                           +--> Restore stock
                           +--> Create IN movement
```

------------------------------------------------------------------------

# Frontend Folder Structure

The project follows a feature-oriented Next.js structure.


```
├── 📁 public
│   ├── 🖼️ file.svg
│   ├── 🖼️ globe.svg
│   ├── 🖼️ next.svg
│   ├── 🖼️ vercel.svg
│   └── 🖼️ window.svg
├── 📁 src
│   ├── 📁 app
│   │   ├── 📁 (dashboard)
│   │   │   ├── 📁 challans
│   │   │   │   ├── 📁 [id]
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 new
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 customers
│   │   │   │   ├── 📁 [id]
│   │   │   │   │   ├── 📁 edit
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 new
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 dashboard
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 inventory
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 products
│   │   │   │   ├── 📁 [id]
│   │   │   │   │   ├── 📁 edit
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 new
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📄 layout.tsx
│   │   ├── 📁 login
│   │   │   └── 📄 page.tsx
│   │   ├── 📄 favicon.ico
│   │   ├── 🎨 globals.css
│   │   ├── 📄 layout.tsx
│   │   └── 📄 page.tsx
│   ├── 📁 components
│   │   ├── 📁 auth
│   │   │   └── 📄 LoginForm.tsx
│   │   ├── 📁 challans
│   │   │   ├── 📄 ChallanActions.tsx
│   │   │   ├── 📄 ChallanDetails.tsx
│   │   │   ├── 📄 ChallanFilters.tsx
│   │   │   ├── 📄 ChallanForm.tsx
│   │   │   ├── 📄 ChallanItems.tsx
│   │   │   ├── 📄 ChallanStatusBadge.tsx
│   │   │   └── 📄 ChallanTable.tsx
│   │   ├── 📁 common
│   │   │   ├── 📄 Pagination.tsx
│   │   │   └── 📄 StatusBadge.tsx
│   │   ├── 📁 customers
│   │   │   ├── 📄 CustomerDetails.tsx
│   │   │   ├── 📄 CustomerFilters.tsx
│   │   │   ├── 📄 CustomerForm.tsx
│   │   │   ├── 📄 CustomerTable.tsx
│   │   │   ├── 📄 FollowUpForm.tsx
│   │   │   └── 📄 FollowUpTimeline.tsx
│   │   ├── 📁 dashboard
│   │   │   ├── 📄 ChallanSummary.tsx
│   │   │   ├── 📄 CustomerSummary.tsx
│   │   │   ├── 📄 LowStockAlert.tsx
│   │   │   └── 📄 SummaryCard.tsx
│   │   ├── 📁 inventory
│   │   │   ├── 📄 CurrentInventoryTable.tsx
│   │   │   ├── 📄 InventoryFilters.tsx
│   │   │   ├── 📄 InventorySummary.tsx
│   │   │   ├── 📄 InventoryTable.tsx
│   │   │   ├── 📄 MovementTable.tsx
│   │   │   ├── 📄 MovementTypeBadge.tsx
│   │   │   └── 📄 StockMovementForm.tsx
│   │   ├── 📁 layout
│   │   │   ├── 📄 Header.tsx
│   │   │   ├── 📄 MobileNav.tsx
│   │   │   ├── 📄 PageContainer.tsx
│   │   │   ├── 📄 Sidebar.tsx
│   │   │   └── 📄 UserMenu.tsx
│   │   ├── 📁 products
│   │   │   ├── 📄 ProductFilters.tsx
│   │   │   ├── 📄 ProductForm.tsx
│   │   │   ├── 📄 ProductStockBadge.tsx
│   │   │   └── 📄 ProductTable.tsx
│   │   └── 📁 ui
│   │       ├── 📄 alert-dialog.tsx
│   │       ├── 📄 badge.tsx
│   │       ├── 📄 button.tsx
│   │       ├── 📄 card.tsx
│   │       ├── 📄 dialog.tsx
│   │       ├── 📄 dropdown-menu.tsx
│   │       ├── 📄 input.tsx
│   │       ├── 📄 select.tsx
│   │       ├── 📄 separator.tsx
│   │       ├── 📄 sheet.tsx
│   │       ├── 📄 skeleton.tsx
│   │       ├── 📄 table.tsx
│   │       ├── 📄 tabs.tsx
│   │       └── 📄 textarea.tsx
│   ├── 📁 hooks
│   │   ├── 📄 useAuth.ts
│   │   ├── 📄 useChallans.ts
│   │   ├── 📄 useCustomers.ts
│   │   ├── 📄 useDashboard.ts
│   │   ├── 📄 useInventory.ts
│   │   └── 📄 useProducts.ts
│   ├── 📁 lib
│   │   ├── 📁 api
│   │   │   ├── 📄 auth.ts
│   │   │   ├── 📄 challans.ts
│   │   │   ├── 📄 client.ts
│   │   │   ├── 📄 customers.ts
│   │   │   ├── 📄 dashboard.ts
│   │   │   ├── 📄 inventory.ts
│   │   │   └── 📄 products.ts
│   │   ├── 📁 auth
│   │   │   ├── 📄 permissions.ts
│   │   │   └── 📄 storage.ts
│   │   ├── 📁 pdf
│   │   │   └── 📄 challanPdf.ts
│   │   ├── 📁 query
│   │   │   └── 📄 queryKeys.ts
│   │   └── 📄 utils.ts
│   ├── 📁 providers
│   │   ├── 📄 AuthProvider.tsx
│   │   └── 📄 QueryProvider.tsx
│   ├── 📁 schemas
│   │   ├── 📄 challan.schema.ts
│   │   ├── 📄 customer.schema.ts
│   │   ├── 📄 inventory.schema.ts
│   │   └── 📄 product.schema.ts
│   └── 📁 types
│       ├── 📄 auth.ts
│       ├── 📄 challan.ts
│       ├── 📄 customer.ts
│       ├── 📄 dashboard.ts
│       ├── 📄 inventory.ts
│       └── 📄 product.ts
├── ⚙️ .gitignore
├── 📝 AGENTS.md
├── 📝 CLAUDE.md
├── 📝 README.md
├── ⚙️ components.json
├── 📄 eslint.config.mjs
├── 📄 next.config.ts
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.mjs
└── ⚙️ tsconfig.json
```

> The exact generated files can vary slightly depending on the
> Next.js/shadcn setup. The structure above describes the intended
> application organization.

------------------------------------------------------------------------

# Important Files

## `src/app/(dashboard)/layout.tsx`

Provides the authenticated application shell.

It is responsible for the dashboard-side layout containing navigation
and shared UI.

------------------------------------------------------------------------

## `src/app/(dashboard)/dashboard/page.tsx`

Main operational dashboard.

It provides:

-   KPI cards
-   Customer analytics
-   Challan pipeline
-   Inventory health
-   Quick actions
-   Role-aware actions
-   Refresh functionality
-   Responsive layouts
-   Loading/error handling

------------------------------------------------------------------------

## `src/hooks/useAuth.ts`

Central authentication hook.

Used by pages/components to access:

``` ts
const { user } = useAuth();
```

and determine the current user's role.

------------------------------------------------------------------------

## `src/hooks/useCustomers.ts`

Contains customer-related data hooks such as:

-   Fetch customers
-   Fetch customer
-   Create customer
-   Update customer
-   Fetch follow-ups
-   Create follow-up

------------------------------------------------------------------------

## `src/hooks/useProducts.ts`

Contains product-related data operations.

------------------------------------------------------------------------

## `src/hooks/useInventory.ts`

Contains inventory and stock movement data operations.

------------------------------------------------------------------------

## `src/hooks/useChallans.ts`

Contains challan-related operations including:

-   List challans
-   Fetch challan
-   Create challan
-   Confirm challan
-   Cancel challan

------------------------------------------------------------------------

## `src/hooks/useDashboard.ts`

Fetches dashboard summary information from the backend.

------------------------------------------------------------------------

## `src/lib/pdf/challanPdf.ts`

Generates the professional sales challan PDF using:

-   jsPDF
-   jspdf-autotable

The PDF contains:

-   FundsRoom header
-   Challan number
-   Status
-   Challan metadata
-   Customer information
-   Created-by information
-   Product table
-   SKU
-   Quantity
-   Unit price
-   Amount
-   Total quantity
-   Total amount
-   Generated timestamp
-   Footer

The filename is generated from the creator's name and challan number.

Example:

``` text
Admin_User_SC-000009.pdf
```

------------------------------------------------------------------------

# Backend Integration

The frontend communicates with the backend through REST APIs.

A centralized API layer should be used instead of scattering raw Axios
calls across components.

Typical structure:

``` text
React Page
    |
    v
Custom Hook
    |
    v
API Client
    |
    v
Axios
    |
    v
Express REST API
```

This separation keeps UI components focused on presentation and user
interaction.

------------------------------------------------------------------------

# API Integration

Representative API groups include:

``` text
Authentication
POST /auth/login
GET  /auth/me

Customers
GET    /customers
GET    /customers/:id
POST   /customers
PATCH  /customers/:id
GET    /customers/:id/follow-ups
POST   /customers/:id/follow-ups

Products
GET    /products
GET    /products/:id
POST   /products
PATCH  /products/:id

Inventory
GET    /inventory
POST   /inventory/movements

Challans
GET    /challans
GET    /challans/:id
POST   /challans
POST   /challans/:id/confirm
POST   /challans/:id/cancel

Dashboard
GET    /dashboard
```

The exact route prefix may be configured by the backend deployment. The
frontend API base URL should therefore come from an environment
variable.

------------------------------------------------------------------------

# Authentication

The application uses JWT-based authentication.

## Login

The user submits:

``` text
Email
Password
```

to the authentication API.

The backend validates credentials and returns the authenticated
user/session information.

The frontend then maintains the authenticated state and includes the JWT
in protected requests.

Protected requests use:

``` http
Authorization: Bearer <JWT>
```

------------------------------------------------------------------------

# Role-Based Access

Frontend UI actions are conditionally rendered according to the
authenticated user's role.

Example:

``` ts
const canManage =
  user?.role === "ADMIN" ||
  user?.role === "SALES";
```

This is used for actions such as:

-   Creating customers
-   Editing customers
-   Creating challans
-   Confirming challans
-   Cancelling challans

The frontend does not replace backend authorization. Backend APIs must
independently validate permissions.

------------------------------------------------------------------------

# Customer CRM

The customer workflow is:

``` text
Customer List
      |
      +--> Search
      |
      +--> Pagination
      |
      +--> Create
      |
      +--> Edit
      |
      +--> Details
              |
              +--> Follow-up history
              |
              +--> Add follow-up
```

The details page provides a dedicated CRM view rather than forcing users
to edit information directly from a table.

------------------------------------------------------------------------

# Products

Product management supports:

``` text
Product List
      |
      +--> Search/filter
      |
      +--> Create
      |
      +--> Edit
```

Product information is later used by inventory and challan workflows.

------------------------------------------------------------------------

# Inventory

Inventory is treated as an operational ledger.

A movement has:

``` text
Product
Quantity
Type
Reason
Created By
Timestamp
```

Movement types:

``` text
IN
OUT
```

Sales challan confirmation produces an OUT movement.

Confirmed challan cancellation restores stock through an IN movement.

This allows the inventory screen to provide both current stock and
operational history.

------------------------------------------------------------------------

# Sales Challans

A challan can contain multiple products.

Example:

``` text
Customer: ABC Traders

Products:
--------------------------------------
Product       SKU        Qty    Price
Monitor       MON-001    5      18500
Keyboard      KEY-001    5      1200
Mouse         MOU-001    5      800
--------------------------------------

Total Quantity: 15
Total Amount:   ₹102,500
```

## Product Snapshot

The challan stores product snapshot information.

The frontend displays:

``` text
productNameSnapshot
skuSnapshot
unitPriceSnapshot
```

instead of assuming that the current product record will always
represent the original transaction.

This preserves historical accuracy.

------------------------------------------------------------------------

# Challan Lifecycle

## Draft

Creating a draft does not represent a completed dispatch.

Stock should remain unchanged.

## Confirmed

When confirmed:

``` text
Validate stock
      ↓
Ensure stock cannot become negative
      ↓
Confirm challan
      ↓
Deduct stock
      ↓
Create OUT movement
```

If stock is insufficient, the backend must return a proper error and the
frontend displays the failure without pretending that the challan was
successfully confirmed.

## Cancelled

Draft cancellation:

``` text
Draft
 ↓
Cancelled
```

Confirmed cancellation:

``` text
Confirmed
 ↓
Cancelled
 ↓
Restore dispatched stock
 ↓
Create IN movement
```

------------------------------------------------------------------------

# Challan PDF Export

The frontend includes PDF export as an enhancement/bonus feature.

The generated document contains:

### Header

``` text
FUNDSROOM
ERP & Business Operations
SALES CHALLAN
```

### Challan information

-   Challan number
-   Created date
-   Updated date
-   Status

### Customer information

-   Customer
-   Business

### Document information

-   Created by
-   Role

### Product table

-   Serial number
-   Product
-   SKU
-   Quantity
-   Unit price
-   Amount

### Summary

-   Total quantity
-   Total amount

### Footer

-   Generated timestamp
-   Status
-   Created by

Example filename:

``` text
Admin_User_SC-000009.pdf
```

The filename is sanitized so that spaces and unsupported filename
characters do not cause problems.

------------------------------------------------------------------------

# Dashboard

The dashboard consumes the dashboard summary API and displays real
backend data.

## KPI Cards

``` text
Customers
Products
Stock Units
Challans
```

## Customer Analytics

Displays:

-   Total customers
-   Active customers
-   Leads
-   Active customer percentage
-   Lead percentage
-   Donut-style visualization

## Challan Analytics

Displays:

-   Total challans
-   Confirmed
-   Draft
-   Cancelled
-   Confirmation percentage
-   Status bars

## Inventory Health

Displays:

-   Total stock units
-   Tracked products
-   Low-stock products
-   Product stock health visualization

## Dashboard Views

The dashboard provides interactive views:

``` text
Overview
Sales
Customers
```

## Quick Actions

Role-aware quick actions include:

-   Add Customer
-   Add Product
-   View Inventory
-   Create Challan

------------------------------------------------------------------------

# Validation and Error Handling

The frontend handles:

-   Loading states
-   API errors
-   Empty results
-   Mutation errors
-   Unauthorized actions
-   Failed confirmations
-   Failed cancellations
-   Insufficient stock responses
-   Retry actions

Example error state:

``` text
Unable to load dashboard

The server returned an unexpected error.

[ Try again ]
```

The UI should never silently fail when an API operation is unsuccessful.

------------------------------------------------------------------------

# HTTP Status Handling

The backend is responsible for returning appropriate HTTP status codes.

The frontend consumes the returned status and error message.

Typical categories include:

``` text
200 / 201
Successful operation

400
Validation / malformed request

401
Unauthenticated

403
Unauthorized

404
Resource not found

409
Business rule conflict

500
Unexpected server error
```

The exact backend response contract should remain the source of truth.

------------------------------------------------------------------------

# Search, Filtering and Pagination

Where required, the frontend exposes search/filter/pagination controls.

This is especially relevant for:

-   Customers
-   Products
-   Inventory
-   Challans

The goal is to avoid loading an unnecessarily large dataset into the
browser.

------------------------------------------------------------------------

# Responsive UI

The frontend is designed as a responsive admin-style interface.

Responsive considerations include:

-   Collapsible/sidebar-aware layouts
-   Responsive tables
-   Mobile-friendly forms
-   Flexible action buttons
-   Responsive dashboard grids
-   Stacked sections on small screens
-   Responsive PDF action placement
-   Touch-friendly controls

The UI prioritizes readability and visibility rather than sacrificing
contrast for decoration.

------------------------------------------------------------------------

# Design System

The interface uses a consistent visual language:

-   Slate-based neutral surfaces
-   White content cards
-   Subtle borders
-   Rounded corners
-   Consistent spacing
-   Lucide icons
-   Clear typography hierarchy
-   Colored status indicators
-   Minimal visual noise

The goal is to keep the interface aesthetic while maintaining strong
readability for operational use.

------------------------------------------------------------------------

# Environment Variables

Create:

``` text
.env.local
```

Example:

``` env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production:

``` env
NEXT_PUBLIC_API_URL=https://your-backend-domain.example/api
```

Do not commit real secrets.

The repository should contain an example configuration such as:

``` text
.env.example
```

with placeholder values only.

------------------------------------------------------------------------

# Local Development

## Prerequisites

Install:

-   Node.js
-   npm
-   Git

The backend and PostgreSQL database must also be available if the
frontend is being run against a real backend.

------------------------------------------------------------------------

## Install dependencies

From the frontend directory:

``` bash
npm install
```

------------------------------------------------------------------------

## Configure environment variables

Create:

``` text
.env.local
```

and set:

``` env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Adjust the URL to match the local backend.

------------------------------------------------------------------------

## Start development server

``` bash
npm run dev
```

The application will normally be available at:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# Production Build

Always verify the production build before deployment:

``` bash
npm run build
```

Then:

``` bash
npm start
```

This helps catch production-only compilation and rendering issues.

------------------------------------------------------------------------

# Deployment

The case study allows free hosting providers and does not require paid
AWS infrastructure.

## Frontend

Recommended options:

``` text
Vercel
Netlify
Render Static Site
```

## Backend

Possible options:

``` text
Render
Railway
Fly.io
```

## Database

Possible options:

``` text
Supabase
Neon
Render PostgreSQL
```

AWS deployment is optional and is considered a bonus.

------------------------------------------------------------------------

# Frontend Deployment Process

A typical Vercel deployment:

``` text
GitHub Repository
       |
       v
Vercel
       |
       +--> Build
       |
       +--> Environment Variables
       |
       v
Live Frontend
```

Set:

``` env
NEXT_PUBLIC_API_URL=https://your-backend-domain/api
```

in the deployment platform's environment settings.

------------------------------------------------------------------------

# Backend Deployment Requirements

The frontend depends on the backend being reachable from the deployed
browser.

The backend must therefore:

-   Be deployed
-   Expose the REST API
-   Allow the frontend origin through CORS
-   Have its own environment variables configured
-   Connect successfully to PostgreSQL
-   Provide valid authentication endpoints
-   Provide all frontend-required API routes

------------------------------------------------------------------------

# CORS

For production, the backend should allow the deployed frontend origin.

Example conceptually:

``` text
Frontend:
https://frontend.example.com

Backend:
https://api.example.com
```

The backend should configure CORS for the actual frontend origin rather
than using an unnecessarily permissive wildcard in production.

------------------------------------------------------------------------

# Testing Checklist

## Authentication

``` text
[ ] Login with valid credentials
[ ] Invalid credentials show an error
[ ] Authenticated user reaches dashboard
[ ] Protected pages cannot be accessed without authentication
[ ] Logout works
[ ] Role is correctly displayed/recognized
```

## Customer CRM

``` text
[ ] Customer list loads
[ ] Search works
[ ] Pagination works
[ ] Create customer works
[ ] Edit customer works
[ ] Customer details work
[ ] Follow-up can be created
[ ] Follow-up history appears
[ ] Validation errors are visible
[ ] Unauthorized roles do not see restricted actions
```

## Products

``` text
[ ] Product list loads
[ ] Search/filter works
[ ] Pagination works
[ ] Product creation works
[ ] Product editing works
[ ] Stock information is visible
[ ] Low-stock information is visible
```

## Inventory

``` text
[ ] Inventory loads
[ ] Current stock is displayed
[ ] IN movements appear
[ ] OUT movements appear
[ ] Filters work
[ ] Pagination works
[ ] Movement history displays creator
[ ] Movement timestamp displays correctly
```

## Challans

``` text
[ ] Challan list loads
[ ] Search/filter works
[ ] Pagination works
[ ] Create challan works
[ ] Customer can be selected
[ ] Multiple products can be added
[ ] Quantity can be entered
[ ] Draft can be created
[ ] Challan number is generated
[ ] Details page loads
[ ] Confirm works
[ ] Stock is reduced after confirmation
[ ] OUT movement is created
[ ] Negative stock is prevented
[ ] Insufficient stock error is shown
[ ] Draft cancellation works
[ ] Confirmed cancellation works
[ ] Stock is restored after confirmed cancellation
[ ] IN movement is created after restoration
[ ] PDF downloads
[ ] PDF contains correct status
[ ] PDF contains customer information
[ ] PDF contains product table
[ ] PDF contains totals
[ ] PDF filename contains creator + challan number
```

## Dashboard

``` text
[ ] Dashboard loads
[ ] KPI cards show backend values
[ ] Customer visualization is correct
[ ] Challan visualization is correct
[ ] Inventory health is correct
[ ] Refresh works
[ ] Quick actions navigate correctly
[ ] Role-based actions are correct
[ ] Loading state works
[ ] Error state works
```

## Responsive

``` text
[ ] Desktop
[ ] Laptop
[ ] Tablet
[ ] Mobile
[ ] No horizontal overflow
[ ] Tables remain usable
[ ] Forms remain usable
[ ] Buttons remain accessible
[ ] Dashboard remains readable
```

------------------------------------------------------------------------

# Role-Based QA Matrix

  Feature                  ADMIN   SALES   WAREHOUSE   ACCOUNTS
  ---------------------- ------- ------- ----------- ----------
  Login                        ✓       ✓           ✓          ✓
  Dashboard                    ✓       ✓           ✓          ✓
  Customer Read                ✓       ✓           ✓          ✓
  Customer Create              ✓       ✓         ---        ---
  Customer Edit                ✓       ✓         ---        ---
  Follow-ups                   ✓       ✓         ---        ---
  Product Read                 ✓       ✓           ✓          ✓
  Product Create/Edit          ✓     ---           ✓        ---
  Inventory Read               ✓       ✓           ✓          ✓
  Inventory Operations         ✓     ---           ✓        ---
  Challan Read                 ✓       ✓           ✓          ✓
  Challan Create               ✓       ✓         ---        ---
  Challan Confirm              ✓       ✓         ---        ---
  Challan Cancel               ✓       ✓         ---        ---
  Challan PDF                  ✓       ✓           ✓          ✓

The exact authorization must always match the backend API's implemented
role policy.

------------------------------------------------------------------------

# Git Workflow

The project is developed using small, meaningful commits.

Example:

``` bash
git add .
git commit -m "feat: add authentication flow"
git push
```

Feature commits should describe the actual change.

Examples:

``` bash
git add .
git commit -m "feat: add customer management"
git push
```

``` bash
git add .
git commit -m "feat: add inventory management"
git push
```

``` bash
git add .
git commit -m "feat: add challan lifecycle workflow"
git push
```

``` bash
git add .
git commit -m "feat: add challan PDF export and interactive dashboard"
git push
```

This creates a readable implementation history for reviewers.

------------------------------------------------------------------------

# Documentation and Submission

The case study requires the submission to include:

1.  GitHub repository link
2.  Live frontend URL
3.  Live backend API URL
4.  Test login credentials for all roles
5.  Postman collection or API documentation
6.  README with setup and deployment instructions
7.  Short architecture explanation
8.  Known limitations or incomplete parts

Before submission, populate the project-specific values below.

------------------------------------------------------------------------

# Submission Information

## GitHub Repository

``` text
TODO: Add GitHub repository URL
```

## Live Frontend

``` text
TODO: Add deployed frontend URL
```

## Live Backend

``` text
TODO: Add deployed backend API URL
```

## API Documentation

``` text
TODO: Add Postman collection / API documentation URL
```

------------------------------------------------------------------------

# Test Credentials

Provide test credentials for every required role.

## ADMIN

``` text
Email:    TODO
Password: TODO
```

## SALES

``` text
Email:    TODO
Password: TODO
```

## WAREHOUSE

``` text
Email:    TODO
Password: TODO
```

## ACCOUNTS

``` text
Email:    TODO
Password: TODO
```

Do not commit real production passwords to the repository.

Use dedicated test accounts.

------------------------------------------------------------------------

# Architecture Summary

The project uses a layered architecture.

``` text
                   ┌──────────────────────┐
                   │       Browser        │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │     Next.js UI       │
                   │ React + TypeScript   │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │    Custom Hooks      │
                   │ TanStack Query       │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │     API Client       │
                   │       Axios          │
                   └──────────┬───────────┘
                              │
                              │ REST / JWT
                              ▼
                   ┌──────────────────────┐
                   │ Express Backend      │
                   │ TypeScript           │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │     PostgreSQL       │
                   └──────────────────────┘
```

The backend handles:

-   Business rules
-   Authentication
-   Authorization
-   Validation
-   Stock transactions
-   Database persistence

The frontend handles:

-   User interface
-   Navigation
-   Form interaction
-   API state
-   Loading/error/empty states
-   Role-aware presentation
-   PDF generation
-   Responsive experience

------------------------------------------------------------------------

# Business Logic Principles

## Stock cannot go negative

The frontend displays backend errors when stock is insufficient.

The actual stock constraint is enforced server-side.

------------------------------------------------------------------------

## Challan confirmation is transactional

A confirmation should result in a consistent business state:

``` text
Challan confirmed
+
Stock deducted
+
OUT movement created
```

A failed confirmation must not leave the system partially updated.

------------------------------------------------------------------------

## Challan cancellation restores confirmed stock

For a previously confirmed challan:

``` text
Cancel
 ↓
Restore stock
 ↓
Create IN movement
```

This preserves the inventory ledger.

------------------------------------------------------------------------

## Historical product information is preserved

Challans use snapshot values for transaction history:

``` text
Product Name Snapshot
SKU Snapshot
Unit Price Snapshot
```

This prevents later product edits from changing the meaning of an
existing sales document.

------------------------------------------------------------------------

# Assumptions

The implementation makes the following practical assumptions:

1.  The backend is the authoritative source for business rules.
2.  The frontend receives authenticated user information from the
    backend.
3.  JWT authentication is used for protected APIs.
4.  The backend provides the API contracts consumed by the frontend.
5.  PostgreSQL is the persistence layer.
6.  Product and challan prices are represented numerically by the
    backend.
7.  Challan product snapshots are persisted by the backend.
8.  The dashboard uses aggregate information supplied by the dashboard
    API.
9.  PDF generation is performed client-side.
10. PDF export is an enhancement and does not replace backend
    transaction records.
11. Frontend role checks improve UX but do not replace backend
    authorization.
12. Production CORS is configured by the backend to allow the deployed
    frontend origin.

------------------------------------------------------------------------

# Known Limitations

## Historical Analytics

The dashboard currently visualizes aggregate operational data returned
by the dashboard API.

It does not claim to provide:

-   Monthly sales history
-   Daily revenue trends
-   Historical stock charts
-   Customer acquisition trends over time

Adding those would require dedicated backend aggregation endpoints and
historical data.

------------------------------------------------------------------------

## PDF Storage

Generated challan PDFs are created in the browser and downloaded
locally.

They are not persisted to cloud storage.

------------------------------------------------------------------------

## Product Images

Product image upload to AWS S3 is not required for the core
implementation and is treated as an optional bonus.

------------------------------------------------------------------------

## Advanced ERP Modules

The case study describes a broader ERP context involving:

-   Purchase orders
-   Invoices
-   Additional operational processes

Only the modules explicitly required for this case study are
implemented.

------------------------------------------------------------------------

# Future Improvements

Possible future improvements include:

## Analytics

``` text
Revenue trends
Monthly challans
Sales trends
Stock movement charts
Customer growth
Top-selling products
```

## Product Images

``` text
AWS S3
Cloudinary
Object storage
```

## Notifications

``` text
Low-stock notifications
Challan confirmation notifications
Follow-up reminders
```

## Advanced Search

``` text
Global search
Advanced filters
Saved filters
```

## Reporting

``` text
Sales reports
Inventory reports
Customer reports
Export CSV/XLSX
```

## DevOps

``` text
Docker
GitHub Actions
Automated deployment
CI checks
```

------------------------------------------------------------------------

# Project Status

## Core Requirements

  Requirement                 Status
  --------------------------- --------------------------
  Authentication              Completed
  Role-based access           Completed
  Customer CRM                Completed
  Product management          Completed
  Inventory management        Completed
  Sales challans              Completed
  Stock validation            Completed
  Stock deduction             Completed
  Stock restoration           Completed
  Search/filtering            Completed where required
  Pagination                  Completed where required
  Responsive admin UI         Implemented
  Operational dashboard       Completed
  Challan PDF export          Completed
  Environment configuration   Implemented
  README/documentation        Completed

## Bonus Features

  Bonus                       Status
  --------------------------- ---------------------------
  Challan PDF export          Completed
  Docker                      Backend/project dependent
  GitHub Actions deployment   Backend/project dependent
  AWS S3 product images       Not implemented

------------------------------------------------------------------------

# Final Pre-Submission Checklist

Before submitting the assignment:

``` text
[ ] Frontend builds successfully
[ ] Backend builds successfully
[ ] PostgreSQL is connected
[ ] Local frontend setup works
[ ] Local backend setup works
[ ] Login works
[ ] ADMIN credentials work
[ ] SALES credentials work
[ ] WAREHOUSE credentials work
[ ] ACCOUNTS credentials work

[ ] Customer CRUD tested
[ ] Follow-ups tested
[ ] Product CRUD tested
[ ] Inventory tested
[ ] Challan creation tested
[ ] Challan confirmation tested
[ ] Insufficient stock tested
[ ] Challan cancellation tested
[ ] Stock restoration tested
[ ] Challan PDF tested
[ ] Dashboard tested

[ ] Desktop UI tested
[ ] Mobile UI tested
[ ] Error states tested
[ ] Loading states tested
[ ] Empty states tested

[ ] Production frontend deployed
[ ] Production backend deployed
[ ] CORS configured
[ ] Environment variables configured
[ ] README updated
[ ] API documentation attached
[ ] Postman collection attached if required
[ ] GitHub repository is accessible
[ ] Test credentials documented
[ ] Live frontend URL documented
[ ] Live backend URL documented
[ ] Known limitations documented
```

------------------------------------------------------------------------

# License

This project was created as part of a Full Stack Developer
case-study/interview assignment.

------------------------------------------------------------------------

# Acknowledgements

Built using the required case-study stack and modern React/Next.js
development practices.

The implementation prioritizes:

-   Clear business workflows
-   Maintainable frontend architecture
-   REST API integration
-   Role-aware UX
-   Transaction-safe backend operations
-   Responsive UI
-   Readability
-   Operational usability
-   Meaningful Git history


# FundsRoom — Mini ERP + CRM Operations Portal

A responsive, role-aware ERP/CRM operations frontend for a wholesale/distribution business.

## Table of Contents

1. Project Overview
2. Features
3. Roles and Permissions
4. Technology Stack
5. Architecture
6. Application Flow
7. Frontend Folder Structure
8. Important Files
9. Backend Integration
10. Authentication
11. Customer CRM
12. Products
13. Inventory
14. Sales Challans
15. Challan PDF Export
16. Invoice Generation and PDF Export
17. Dashboard
18. Validation and Error Handling
19. Responsive UI
20. Environment Variables
21. Local Development
22. Production Build
23. Deployment
24. Testing Checklist
25. Git Workflow
26. Submission Information
27. Architecture Summary
28. Business Logic Principles
29. Assumptions
30. Known Limitations
31. Future Improvements
32. Project Status
33. Final Pre-Submission Checklist

---

# Project Overview

FundsRoom is a Mini ERP + CRM Operations Portal designed for a wholesale/distribution business.

The frontend provides an employee-facing interface for:

- Authentication
- Role-based access
- Customer CRM
- Customer follow-ups
- Product management
- Inventory management
- Inventory movement history
- Sales challans
- Challan lifecycle management
- Stock-aware challan confirmation
- Challan cancellation and stock restoration
- Challan PDF export
- Invoice generation from confirmed challans
- Professional invoice PDF export
- Invoice download
- Operational dashboard
- Low-stock visibility
- Responsive administration

The application is designed around real business workflows instead of disconnected CRUD screens.

---

# Case Study Requirements

The case study requires a small ERP/CRM system for a wholesale/distribution company.

Required business areas include:

- Authentication and roles
- Customer CRM
- Product and inventory management
- Sales challans
- Clean REST APIs
- Validation and error handling
- Pagination/search/filtering where appropriate
- Responsive admin-style frontend
- Deployment documentation
- Environment variable management
- README and architecture documentation
- Proper Git commits

The required roles are:

- Admin
- Sales
- Warehouse
- Accounts

The assignment also lists PDF export, Docker, GitHub Actions, and AWS S3 product images as bonus features.

Implemented enhancements include:

- Challan PDF export
- Invoice PDF export
- Interactive operational dashboard

---

# Features

## Authentication

- JWT-based login
- Persistent authenticated session
- Current-user state
- Role-aware navigation
- Protected dashboard routes
- Logout
- UI-level authorization checks

The backend remains the authoritative security boundary.

## Landing Page

The root page provides a simple public FundsRoom landing page rather than immediately redirecting to login.

It provides:

- FundsRoom branding
- ERP/CRM description
- Central login CTA
- Responsive presentation

## Customer CRM

Supports:

- Customer listing
- Search
- Pagination
- Customer creation
- Customer editing
- Customer details
- Customer status
- Customer type
- Follow-up notes
- Follow-up history
- Role-aware actions
- Loading, empty and error states

Customer fields include:

- Customer name
- Mobile number
- Email
- Business name
- GST number
- Customer type
- Address
- Status
- Follow-up date
- Notes

Customer types:

- Retail
- Wholesale
- Distributor

Statuses:

- Lead
- Active
- Inactive

## Product Management

Supports:

- Product listing
- Search/filtering
- Pagination
- Product creation
- Product editing
- SKU/code
- Category
- Unit price
- Current stock
- Minimum stock threshold
- Warehouse/location
- Low-stock visibility

## Inventory Management

Supports:

- Current stock visibility
- Inventory movement history
- IN movements
- OUT movements
- Product filtering
- Movement filtering
- Pagination
- Quantity changes
- Movement reason
- Created-by information
- Timestamp visibility

## Sales Challans

The challan workflow supports:

```text
Create Draft
     ↓
Review
     ↓
Confirm
     ↓
Stock Deduction
```

or:

```text
Draft
  ↓
Cancel
```

and:

```text
Confirmed
    ↓
Cancel
    ↓
Stock Restoration
```

Features include:

- Challan listing
- Search/filtering
- Pagination
- Customer selection
- Multiple products
- Quantity per product
- Automatic challan number
- Draft/confirmed/cancelled status
- Customer information
- Product snapshot information
- Total quantity
- Total amount
- Created-by information
- Confirmation workflow
- Cancellation workflow
- Stock-aware confirmation
- Challan PDF export
- Invoice generation from confirmed challans
- Invoice PDF export

---

# Roles and Permissions

| Role | Primary Responsibility |
|---|---|
| ADMIN | Full operational access |
| SALES | Customers, follow-ups, sales challans |
| WAREHOUSE | Products and inventory operations |
| ACCOUNTS | Financial/operational visibility |

Example frontend permission:

```ts
const canManage =
  user?.role === "ADMIN" ||
  user?.role === "SALES";
```

Frontend permissions control presentation and UX. Backend authorization must independently protect every API operation.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Lucide React icons
- Axios
- TanStack Query / React Query
- jsPDF
- jspdf-autotable

## Backend

- Node.js
- TypeScript
- Express.js
- REST APIs
- JWT authentication

## Database

- PostgreSQL

## Possible Deployment

- Vercel
- Netlify
- Render
- Railway
- Fly.io
- Supabase
- Neon

AWS deployment is optional.

---

# Architecture

```text
Browser
   |
   v
Next.js / React UI
   |
   +----------------------+
   |                      |
   v                      v
Hooks                  UI Components
   |                      |
   +----------+-----------+
              |
              v
        API Client Layer
              |
              v
       REST Backend APIs
              |
              v
          PostgreSQL
```

Authentication:

```text
User
 |
 | Login credentials
 v
POST /auth/login
 |
 v
Backend validates user
 |
 v
JWT returned
 |
 v
Frontend authenticated state
 |
 v
Protected API requests
 |
 | Authorization: Bearer <JWT>
 v
Backend
```

PDF workflow:

```text
Confirmed Challan
       |
       +----------------------+
       |                      |
       v                      v
Challan PDF             Invoice Page
       |                      |
       v                      v
Challan Document        Invoice PDF
```

---

# Application Flow

## Landing Page

```text
/
 |
 v
FundsRoom Landing Page
 |
 v
Login
 |
 v
/login
```

## Login

```text
/login
   |
   v
LoginForm
   |
   v
Authentication hook
   |
   v
POST /auth/login
   |
   v
Authenticated user
   |
   v
/dashboard
```

## Customer Flow

```text
Customers
   |
   +--> Search
   +--> Create
   +--> Edit
   +--> Details
          |
          +--> Follow-up history
          +--> Add follow-up
```

## Inventory Flow

```text
Inventory
   |
   +--> Current stock
   +--> Movement history
   +--> IN
   +--> OUT
```

## Challan and Invoice Flow

```text
Challan List
    |
    +--> Create Draft
    |       |
    |       +--> Select customer
    |       +--> Select products
    |       +--> Add quantities
    |
    +--> Details
            |
            +--> Download Challan PDF
            |
            +--> Confirm
            |      |
            |      +--> Backend checks stock
            |      +--> Deduct stock
            |      +--> Create OUT movement
            |
            +--> Cancel
            |      |
            |      +--> Draft cancellation
            |      +--> Confirmed cancellation
            |             |
            |             +--> Restore stock
            |             +--> Create IN movement
            |
            +--> Generate Invoice
                    |
                    +--> Invoice Page
                    |
                    +--> Download Invoice PDF
```

---

# Frontend Folder Structure

```text
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src
│   ├── app
│   │   ├── (dashboard)
│   │   │   ├── challans
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── customers
│   │   │   │   ├── [id]
│   │   │   │   │   ├── edit
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── inventory
│   │   │   │   └── page.tsx
│   │   │   ├── invoices
│   │   │   │   └── [challan]
│   │   │   │       └── page.tsx
│   │   │   ├── products
│   │   │   │   ├── [id]
│   │   │   │   │   ├── edit
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components
│   │   ├── auth
│   │   │   └── LoginForm.tsx
│   │   ├── challans
│   │   │   ├── ChallanActions.tsx
│   │   │   ├── ChallanDetails.tsx
│   │   │   ├── ChallanFilters.tsx
│   │   │   ├── ChallanForm.tsx
│   │   │   ├── ChallanItems.tsx
│   │   │   ├── ChallanStatusBadge.tsx
│   │   │   └── ChallanTable.tsx
│   │   ├── common
│   │   │   ├── Pagination.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── customers
│   │   │   ├── CustomerDetails.tsx
│   │   │   ├── CustomerFilters.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── CustomerTable.tsx
│   │   │   ├── FollowUpForm.tsx
│   │   │   └── FollowUpTimeline.tsx
│   │   ├── dashboard
│   │   │   ├── ChallanSummary.tsx
│   │   │   ├── CustomerSummary.tsx
│   │   │   ├── LowStockAlert.tsx
│   │   │   └── SummaryCard.tsx
│   │   ├── inventory
│   │   │   ├── CurrentInventoryTable.tsx
│   │   │   ├── InventoryFilters.tsx
│   │   │   ├── InventorySummary.tsx
│   │   │   ├── InventoryTable.tsx
│   │   │   ├── MovementTable.tsx
│   │   │   ├── MovementTypeBadge.tsx
│   │   │   └── StockMovementForm.tsx
│   │   ├── layout
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── PageContainer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── products
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductStockBadge.tsx
│   │   │   └── ProductTable.tsx
│   │   └── ui
│   │       ├── alert-dialog.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       └── textarea.tsx
│   │
│   ├── hooks
│   │   ├── useAuth.ts
│   │   ├── useChallans.ts
│   │   ├── useCustomers.ts
│   │   ├── useDashboard.ts
│   │   ├── useInventory.ts
│   │   └── useProducts.ts
│   │
│   ├── lib
│   │   ├── api
│   │   │   ├── auth.ts
│   │   │   ├── challans.ts
│   │   │   ├── client.ts
│   │   │   ├── customers.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── inventory.ts
│   │   │   └── products.ts
│   │   ├── auth
│   │   │   ├── permissions.ts
│   │   │   └── storage.ts
│   │   ├── pdf
│   │   │   ├── challanPdf.ts
│   │   │   └── invoicePdf.ts
│   │   ├── query
│   │   │   └── queryKeys.ts
│   │   └── utils.ts
│   │
│   ├── providers
│   │   ├── AuthProvider.tsx
│   │   └── QueryProvider.tsx
│   ├── schemas
│   │   ├── challan.schema.ts
│   │   ├── customer.schema.ts
│   │   ├── inventory.schema.ts
│   │   └── product.schema.ts
│   └── types
│       ├── auth.ts
│       ├── challan.ts
│       ├── customer.ts
│       ├── dashboard.ts
│       ├── inventory.ts
│       └── product.ts
│
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

> Exact generated files can vary slightly depending on the Next.js/shadcn setup.

---

# Important Files

## `src/app/page.tsx`

Public FundsRoom landing page containing branding, application description and login CTA.

## `src/app/(dashboard)/layout.tsx`

Authenticated application shell containing navigation and shared dashboard UI.

## `src/app/(dashboard)/dashboard/page.tsx`

Main operational dashboard containing KPI cards, customer analytics, challan pipeline, inventory health, quick actions and interactive visualizations.

## `src/app/(dashboard)/invoices/[challan]/page.tsx`

Dedicated invoice page containing invoice presentation, invoice metadata, customer/billing information, products, totals and an explicit `Download Invoice PDF` action.

## `src/hooks/useAuth.ts`

Central authentication hook used to access the authenticated user and role.

## `src/hooks/useCustomers.ts`

Customer queries and mutations including customer CRUD and follow-ups.

## `src/hooks/useProducts.ts`

Product-related data operations.

## `src/hooks/useInventory.ts`

Inventory and stock movement operations.

## `src/hooks/useChallans.ts`

Challan listing, details, creation, confirmation and cancellation.

## `src/hooks/useDashboard.ts`

Fetches dashboard summary information.

## `src/lib/pdf/challanPdf.ts`

Generates the sales challan PDF with:

- FundsRoom header
- Challan number
- Status
- Customer
- Created-by information
- Product table
- SKU
- Quantity
- Unit price
- Amount
- Totals
- Timestamp
- Footer

Example filename:

```text
Admin_User_SC-000009.pdf
```

## `src/lib/pdf/invoicePdf.ts`

Generates a professional A4 invoice PDF using jsPDF and jspdf-autotable.

It includes:

- Invoice title and number
- Status
- Invoice date
- Reference challan
- Bill From
- Bill To
- Customer/business details
- Product table
- SKU
- Quantity
- Unit price
- Line-item amount
- Total quantity
- Subtotal
- Grand total
- Created-by information
- Transaction information
- Footer
- Page numbering

Alignment:

- Quantity — right
- Unit price — right
- Amount — right
- SKU — centered
- Description — left

Example filename:

```text
Admin_User_INV-000010.pdf
```

---

# Backend Integration

The frontend communicates with the backend through REST APIs.

```text
React Page
    |
    v
Custom Hook
    |
    v
API Client
    |
    v
Axios
    |
    v
Express REST API
    |
    v
PostgreSQL
```

This keeps UI components focused on presentation and interaction.

---

# API Integration

Representative API groups:

```text
Authentication
POST /auth/login
GET  /auth/me

Customers
GET    /customers
GET    /customers/:id
POST   /customers
PATCH  /customers/:id
GET    /customers/:id/follow-ups
POST   /customers/:id/follow-ups

Products
GET    /products
GET    /products/:id
POST   /products
PATCH  /products/:id

Inventory
GET    /inventory
POST   /inventory/movements

Challans
GET    /challans
GET    /challans/:id
POST   /challans
POST   /challans/:id/confirm
POST   /challans/:id/cancel

Dashboard
GET    /dashboard
```

The exact route prefix is controlled by the backend deployment.

The frontend API base URL is configured through an environment variable.

---

# Invoice API Architecture

The current invoice PDF implementation uses confirmed challan data retrieved from the challan API.

A separate invoice CRUD API is not required for the current client-side PDF implementation.

```text
GET /challans/:id
       |
       v
Confirmed Challan
       |
       v
Invoice Page
       |
       v
Client-side Invoice PDF Generator
       |
       v
Invoice PDF Download
```

The original confirmed challan remains the source transaction.

Invoice generation does not independently modify inventory.

---

# Authentication

The application uses JWT-based authentication.

Login credentials are submitted to the authentication API.

Protected requests use:

```http
Authorization: Bearer <JWT>
```

The frontend maintains authenticated state and sends the token with protected requests.

---

# Role-Based Access

UI actions are conditionally rendered according to the authenticated role.

Example:

```ts
const canManage =
  user?.role === "ADMIN" ||
  user?.role === "SALES";
```

Typical role-aware actions include:

- Creating customers
- Editing customers
- Creating challans
- Confirming challans
- Cancelling challans

The backend must independently validate all permissions.

---

# Customer CRM

Workflow:

```text
Customer List
      |
      +--> Search
      +--> Pagination
      +--> Create
      +--> Edit
      +--> Details
              |
              +--> Follow-up history
              +--> Add follow-up
```

---

# Products

Product management supports:

```text
Product List
      |
      +--> Search/filter
      +--> Create
      +--> Edit
```

Product data is reused by inventory and challan workflows.

---

# Inventory

Inventory is treated as an operational ledger.

A movement contains:

```text
Product
Quantity
Type
Reason
Created By
Timestamp
```

Movement types:

```text
IN
OUT
```

Sales challan confirmation creates an OUT movement.

Confirmed challan cancellation restores stock through an IN movement.

---

# Sales Challans

A challan can contain multiple products.

Example:

```text
Customer: ABC Traders

Products:
--------------------------------------
Product       SKU        Qty    Price
Monitor       MON-001    5      18500
Keyboard      KEY-001    5      1200
Mouse         MOU-001    5      800
--------------------------------------

Total Quantity: 15
Total Amount:   ₹102,500
```

## Product Snapshot

Historical transaction values use snapshot fields such as:

```text
productNameSnapshot
skuSnapshot
unitPriceSnapshot
```

This prevents later product edits from changing the meaning of an existing challan.

---

# Challan Lifecycle

## Draft

Creating a draft does not represent a completed dispatch. Stock remains unchanged.

## Confirmed

```text
Validate stock
      ↓
Ensure stock cannot become negative
      ↓
Confirm challan
      ↓
Deduct stock
      ↓
Create OUT movement
```

If stock is insufficient, the backend returns an error and the frontend displays it.

## Cancelled

Draft:

```text
Draft
  ↓
Cancelled
```

Confirmed:

```text
Confirmed
  ↓
Cancelled
  ↓
Restore dispatched stock
  ↓
Create IN movement
```

---

# Challan PDF Export

The generated challan document contains:

- FundsRoom header
- Sales Challan title
- Challan number
- Created date
- Updated date
- Status
- Customer
- Business
- Created by
- Role
- Product table
- SKU
- Quantity
- Unit price
- Amount
- Total quantity
- Total amount
- Generated timestamp
- Footer

Example filename:

```text
Admin_User_SC-000009.pdf
```

---

# Invoice Generation and PDF Export

FundsRoom supports invoice generation from confirmed sales challans.

An invoice represents the billing document generated after a sales challan has successfully completed its confirmation workflow.

## Invoice Workflow

```text
Sales Challan
      |
      v
Draft
      |
      v
Confirm Challan
      |
      +--> Stock validation
      +--> Stock deduction
      +--> OUT inventory movement
      |
      v
Confirmed
      |
      v
Generate Invoice
      |
      v
Invoice Page
      |
      v
Download Invoice PDF
```

## Invoice Eligibility

Only confirmed challans can generate invoices.

A draft challan cannot be converted into an invoice because its inventory transaction has not yet been completed.

The frontend checks:

```ts
if (challan.status === "CONFIRMED") {
  // Generate invoice
}
```

## Invoice Page

Route:

```text
/invoices/[challan]
```

It provides:

- Invoice title
- Invoice number
- Reference challan
- Customer information
- Billing information
- Product information
- Invoice totals
- Invoice status
- Created-by information
- Back-to-challan navigation
- Download Invoice PDF action

## Invoice Number

Invoice numbers are derived from the corresponding confirmed challan.

Example:

```text
Challan:
SC-000010

Invoice:
INV-000010
```

## Invoice PDF

The invoice is generated client-side with:

```text
jsPDF
jspdf-autotable
```

It uses a structured A4 layout and is visually distinct from the challan PDF.

### Header

```text
FUNDSROOM
ERP & Business Operations

TAX INVOICE
INV-000010
CONFIRMED
```

### Billing Details

```text
BILL FROM                  BILL TO

FundsRoom                  Customer Name
ERP & Business Operations  Business Name
Sales & Distribution
```

### Product Table

```text
# | Description | SKU | Qty | Unit Price | Amount
```

Numerical columns are aligned consistently.

### Summary

```text
Total Quantity              15
Subtotal             INR 102,500.00
Grand Total          INR 102,500.00
```

### Footer

The invoice contains document identification and page numbering.

### Download

The invoice page provides an explicit:

```text
Download Invoice PDF
```

button.

Example filename:

```text
Admin_User_INV-000010.pdf
```

---

# Challan vs Invoice

## Sales Challan

Represents the physical/business dispatch transaction.

Focuses on:

- Dispatch
- Customer
- Products
- Quantities
- Stock movement
- Confirmation status

Example:

```text
SALES CHALLAN
SC-000010
```

## Invoice

Represents the billing document generated from a confirmed challan.

Focuses on:

- Billing
- Invoice number
- Customer
- Product pricing
- Amounts
- Grand total
- Transaction reference
- Invoice status

Example:

```text
TAX INVOICE
INV-000010
```

The documents are intentionally visually different while maintaining a traceable relationship.

---

# Dashboard

The dashboard consumes the dashboard summary API.

## KPI Cards

```text
Customers
Products
Stock Units
Challans
```

## Customer Analytics

Displays:

- Total customers
- Active customers
- Leads
- Active customer percentage
- Lead percentage
- Donut-style visualization

## Challan Analytics

Displays:

- Total challans
- Confirmed
- Draft
- Cancelled
- Confirmation percentage
- Status bars

## Inventory Health

Displays:

- Total stock units
- Tracked products
- Low-stock products
- Product stock health visualization

## Dashboard Views

```text
Overview
Sales
Customers
```

## Quick Actions

- Add Customer
- Add Product
- View Inventory
- Create Challan

---

# Validation and Error Handling

The frontend handles:

- Loading states
- API errors
- Empty results
- Mutation errors
- Unauthorized actions
- Failed confirmations
- Failed cancellations
- Insufficient stock responses
- Retry actions
- PDF generation errors where applicable

Example:

```text
Unable to load dashboard

The server returned an unexpected error.

[ Try again ]
```

The UI should never silently fail.

---

# HTTP Status Handling

Typical backend status categories:

```text
200 / 201
Successful operation

400
Validation / malformed request

401
Unauthenticated

403
Unauthorized

404
Resource not found

409
Business rule conflict

500
Unexpected server error
```

The backend response contract remains the source of truth.

---

# Search, Filtering and Pagination

Search/filter/pagination controls are used where appropriate, especially for:

- Customers
- Products
- Inventory
- Challans

This avoids unnecessarily loading large datasets into the browser.

---

# Responsive UI

The frontend is designed as a responsive admin-style interface.

Considerations include:

- Responsive tables
- Mobile-friendly forms
- Flexible action buttons
- Responsive dashboard grids
- Stacked sections on small screens
- Responsive PDF action placement
- Touch-friendly controls
- Readable contrast and typography

The design prioritizes visibility and usability.

---

# Design System

The interface uses:

- Slate-based neutral surfaces
- White content cards
- Subtle borders
- Rounded corners
- Consistent spacing
- Lucide icons
- Clear typography hierarchy
- Colored status indicators
- Minimal visual noise

---

# Environment Variables

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Production:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.example/api
```

Do not commit secrets.

Use `.env.example` with placeholder values where appropriate.

---

# Local Development

## Prerequisites

- Node.js
- npm
- Git
- Running backend
- PostgreSQL database

## Install

```bash
npm install
```

## Configure

Create:

```text
.env.local
```

Set:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Start

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

# Production Build

Verify:

```bash
npm run build
```

Then:

```bash
npm start
```

This catches production compilation and rendering issues before deployment.

---

# Deployment

## Frontend

Possible platforms:

- Vercel
- Netlify
- Render

## Backend

Possible platforms:

- Render
- Railway
- Fly.io

## Database

Possible platforms:

- Supabase
- Neon
- Render PostgreSQL

AWS deployment is optional.

---

# Frontend Deployment

Typical flow:

```text
GitHub Repository
       |
       v
Vercel
       |
       +--> Build
       +--> Environment Variables
       |
       v
Live Frontend
```

Production environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain/api
```

---

# Backend Deployment Requirements

The deployed backend must:

- Be reachable from the frontend
- Expose the REST API
- Allow the frontend origin through CORS
- Have environment variables configured
- Connect to PostgreSQL
- Provide authentication endpoints
- Provide all required API routes

---

# CORS

Production CORS should allow the actual frontend origin.

Example:

```text
Frontend:
https://frontend.example.com

Backend:
https://api.example.com
```

Avoid unnecessarily permissive production CORS configuration.

---

# Testing Checklist

## Authentication

```text
[ ] Landing page loads
[ ] Login button navigates to login
[ ] Valid login works
[ ] Invalid credentials show an error
[ ] Authenticated user reaches dashboard
[ ] Protected pages are protected
[ ] Logout works
[ ] Role is correctly displayed
```

## Customer CRM

```text
[ ] Customer list loads
[ ] Search works
[ ] Pagination works
[ ] Create customer works
[ ] Edit customer works
[ ] Customer details work
[ ] Follow-up can be created
[ ] Follow-up history appears
[ ] Validation errors are visible
[ ] Unauthorized roles do not see restricted actions
```

## Products

```text
[ ] Product list loads
[ ] Search/filter works
[ ] Pagination works
[ ] Product creation works
[ ] Product editing works
[ ] Stock information is visible
[ ] Low-stock information is visible
```

## Inventory

```text
[ ] Inventory loads
[ ] Current stock is displayed
[ ] IN movements appear
[ ] OUT movements appear
[ ] Filters work
[ ] Pagination works
[ ] Creator is displayed
[ ] Timestamp is displayed
```

## Challans

```text
[ ] Challan list loads
[ ] Search/filter works
[ ] Pagination works
[ ] Create challan works
[ ] Customer can be selected
[ ] Multiple products can be added
[ ] Quantity can be entered
[ ] Draft can be created
[ ] Challan number is generated
[ ] Details page loads
[ ] Confirm works
[ ] Stock is reduced after confirmation
[ ] OUT movement is created
[ ] Negative stock is prevented
[ ] Insufficient stock error is shown
[ ] Draft cancellation works
[ ] Confirmed cancellation works
[ ] Stock is restored after confirmed cancellation
[ ] IN movement is created after restoration
[ ] Download Challan PDF works
[ ] Challan PDF contains status
[ ] Challan PDF contains customer
[ ] Challan PDF contains product table
[ ] Challan PDF contains totals
[ ] Challan filename contains creator + challan number
```

## Invoice

```text
[ ] Invoice page opens for a confirmed challan
[ ] Draft challan does not show invoice generation
[ ] Invoice number is correct
[ ] Invoice references the correct challan
[ ] Invoice status is correct
[ ] Customer information is correct
[ ] Bill From is displayed
[ ] Bill To is displayed
[ ] Product table is displayed
[ ] Product names are correct
[ ] SKU values are correct
[ ] Quantities are correct
[ ] Unit prices are correct
[ ] Line-item amounts are correct
[ ] Subtotal is correct
[ ] Grand total is correct
[ ] Created-by information is correct
[ ] Source challan is correct
[ ] Download Invoice PDF button is visible
[ ] Download Invoice PDF works
[ ] Invoice PDF is generated
[ ] Invoice PDF uses A4 layout
[ ] PDF columns are aligned
[ ] Quantity values are aligned
[ ] Unit prices are aligned
[ ] Amount values are aligned
[ ] Monetary values are formatted correctly
[ ] Invoice number appears in PDF
[ ] Reference challan appears in PDF
[ ] Customer information appears in PDF
[ ] Totals appear in PDF
[ ] Invoice filename contains creator
[ ] Invoice filename contains invoice number
[ ] Invoice PDF differs visually from challan PDF
[ ] Multi-product invoices work
[ ] Multi-page invoices work
[ ] Footer and page numbers work
```

## Dashboard

```text
[ ] Dashboard loads
[ ] KPI cards show backend values
[ ] Customer visualization is correct
[ ] Challan visualization is correct
[ ] Inventory health is correct
[ ] Refresh works
[ ] Quick actions navigate correctly
[ ] Role-based actions are correct
[ ] Loading state works
[ ] Error state works
```

## Responsive

```text
[ ] Desktop
[ ] Laptop
[ ] Tablet
[ ] Mobile
[ ] No horizontal overflow
[ ] Tables remain usable
[ ] Forms remain usable
[ ] Buttons remain accessible
[ ] Dashboard remains readable
[ ] Invoice page remains readable
[ ] Challan page remains readable
```

---

# Role-Based QA Matrix

| Feature | ADMIN | SALES | WAREHOUSE | ACCOUNTS |
|---|---:|---:|---:|---:|
| Login | ✓ | ✓ | ✓ | ✓ |
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Customer Read | ✓ | ✓ | ✓ | ✓ |
| Customer Create | ✓ | ✓ | — | — |
| Customer Edit | ✓ | ✓ | — | — |
| Follow-ups | ✓ | ✓ | — | — |
| Product Read | ✓ | ✓ | ✓ | ✓ |
| Product Create/Edit | ✓ | — | ✓ | — |
| Inventory Read | ✓ | ✓ | ✓ | ✓ |
| Inventory Operations | ✓ | — | ✓ | — |
| Challan Read | ✓ | ✓ | ✓ | ✓ |
| Challan Create | ✓ | ✓ | — | — |
| Challan Confirm | ✓ | ✓ | — | — |
| Challan Cancel | ✓ | ✓ | — | — |
| Challan PDF | ✓ | ✓ | ✓ | ✓ |
| Invoice View | ✓ | ✓ | ✓ | ✓ |
| Invoice PDF | ✓ | ✓ | ✓ | ✓ |

The exact authorization must match the backend's implemented policy.

---

# Git Workflow

The project is developed using small, meaningful commits.

Example:

```bash
git add .
git commit -m "feat: add authentication flow"
git push
```

Feature examples:

```bash
git add .
git commit -m "feat: add customer management"
git push
```

```bash
git add .
git commit -m "feat: add inventory management"
git push
```

```bash
git add .
git commit -m "feat: add challan lifecycle workflow"
git push
```

```bash
git add .
git commit -m "feat: add challan PDF export"
git push
```

```bash
git add .
git commit -m "feat: add invoice generation and PDF export"
git push
```

```bash
git add .
git commit -m "feat: enhance dashboard with interactive analytics"
git push
```

This creates a readable implementation history for reviewers.

---

# Documentation and Submission

The submission should include:

1. GitHub repository link
2. Live frontend URL
3. Live backend API URL
4. Test login credentials for all roles
5. Postman collection or API documentation
6. README with setup/deployment instructions
7. Architecture explanation
8. Known limitations

---

# Submission Information

## GitHub Repository

```text
TODO: Add GitHub repository URL
```

## Live Frontend

```text
TODO: Add deployed frontend URL
```

## Live Backend

```text
TODO: Add deployed backend API URL
```

## API Documentation

```text
TODO: Add Postman collection / API documentation URL
```

---

# Test Credentials

## ADMIN

```text
Email:    TODO
Password: TODO
```

## SALES

```text
Email:    TODO
Password: TODO
```

## WAREHOUSE

```text
Email:    TODO
Password: TODO
```

## ACCOUNTS

```text
Email:    TODO
Password: TODO
```

Do not commit production passwords. Use dedicated test accounts.

---

# Architecture Summary

```text
                   ┌──────────────────────┐
                   │       Browser        │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │     Next.js UI       │
                   │ React + TypeScript   │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │    Custom Hooks      │
                   │   TanStack Query     │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │     API Client       │
                   │       Axios          │
                   └──────────┬───────────┘
                              │
                              │ REST / JWT
                              ▼
                   ┌──────────────────────┐
                   │  Express Backend     │
                   │  TypeScript          │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │      PostgreSQL      │
                   └──────────────────────┘
```

Backend responsibilities:

- Business rules
- Authentication
- Authorization
- Validation
- Stock transactions
- Database persistence

Frontend responsibilities:

- User interface
- Navigation
- Form interaction
- API state
- Loading/error/empty states
- Role-aware presentation
- PDF generation
- Responsive experience

---

# Business Logic Principles

## Stock Cannot Go Negative

The frontend displays backend errors when stock is insufficient.

The actual stock constraint is enforced server-side.

## Challan Confirmation Is Transactional

A successful confirmation should result in:

```text
Challan confirmed
+
Stock deducted
+
OUT movement created
```

A failed confirmation must not leave the system partially updated.

## Challan Cancellation Restores Confirmed Stock

```text
Cancel
  ↓
Restore stock
  ↓
Create IN movement
```

## Historical Product Information Is Preserved

Challans use:

```text
Product Name Snapshot
SKU Snapshot
Unit Price Snapshot
```

This preserves the original transaction even if the product is edited later.

## Invoice Is Derived From a Confirmed Challan

```text
Confirmed Challan
       |
       v
Invoice
```

Invoice PDF generation does not perform stock mutations.

---

# Assumptions

1. The backend is the authoritative source for business rules.
2. The frontend receives authenticated user information from the backend.
3. JWT authentication is used for protected APIs.
4. The backend provides the API contracts consumed by the frontend.
5. PostgreSQL is the persistence layer.
6. Product and challan prices are represented numerically by the backend.
7. Challan product snapshots are persisted by the backend.
8. Dashboard values are supplied by the dashboard API.
9. PDF generation is performed client-side.
10. PDF export does not replace backend transaction records.
11. Frontend role checks improve UX but do not replace backend authorization.
12. Production CORS allows the deployed frontend origin.
13. Invoice generation uses confirmed challan information.
14. Invoice PDF generation is performed client-side.
15. Invoice generation does not independently modify inventory.

---

# Known Limitations

## Historical Analytics

The dashboard currently visualizes aggregate operational data returned by the dashboard API.

It does not claim to provide:

- Monthly sales history
- Daily revenue trends
- Historical stock charts
- Customer acquisition trends over time

Those require dedicated backend aggregation endpoints and historical data.

## PDF Storage

Generated challan and invoice PDFs are created in the browser and downloaded locally. They are not persisted to cloud storage.

## Product Images

AWS S3 product image upload is treated as an optional bonus and is not required for the core implementation.

## Advanced ERP Modules

The following are outside the current scope:

- Purchase orders
- Purchase returns
- Credit notes
- Debit notes
- Payment collection
- Accounts receivable
- Accounts payable
- GST filing/reporting
- Advanced financial accounting
- Automated invoice cloud storage

---

# Future Improvements

## Analytics

- Revenue trends
- Monthly challans
- Sales trends
- Stock movement charts
- Customer growth
- Top-selling products

## Product Images

- AWS S3
- Cloudinary
- Object storage

## Notifications

- Low-stock notifications
- Challan confirmation notifications
- Follow-up reminders

## Advanced Search

- Global search
- Advanced filters
- Saved filters

## Reporting

- Sales reports
- Inventory reports
- Customer reports
- Invoice reports
- CSV/XLSX export

## Invoice Enhancements

- Invoice persistence
- Invoice history
- Invoice search
- Invoice numbering service
- GST/tax breakdown
- Discount handling
- Payment status
- Due dates
- Credit notes
- Invoice email delivery
- Cloud PDF storage

## DevOps

- Docker
- GitHub Actions
- Automated deployment
- CI checks

---

# Project Status

## Core Requirements

| Requirement | Status |
|---|---|
| Authentication | Completed |
| Role-based access | Completed |
| Public landing page | Completed |
| Customer CRM | Completed |
| Product management | Completed |
| Inventory management | Completed |
| Sales challans | Completed |
| Stock validation | Completed |
| Stock deduction | Completed |
| Stock restoration | Completed |
| Search/filtering | Completed where required |
| Pagination | Completed where required |
| Responsive admin UI | Implemented |
| Operational dashboard | Completed |
| Challan PDF export | Completed |
| Invoice generation | Completed |
| Invoice PDF export | Completed |
| Invoice download | Completed |
| Environment configuration | Implemented |
| README/documentation | Completed |

## Bonus Features

| Bonus | Status |
|---|---|
| Challan PDF export | Completed |
| Invoice PDF export | Completed |
| Interactive dashboard analytics | Completed |
| Docker | Backend/project dependent |
| GitHub Actions deployment | Backend/project dependent |
| AWS S3 product images | Not implemented |

---

# Final Pre-Submission Checklist

```text
[ ] Frontend builds successfully
[ ] Backend builds successfully
[ ] PostgreSQL is connected
[ ] Local frontend setup works
[ ] Local backend setup works

[ ] Landing page works
[ ] Login works
[ ] ADMIN credentials work
[ ] SALES credentials work
[ ] WAREHOUSE credentials work
[ ] ACCOUNTS credentials work

[ ] Customer CRUD tested
[ ] Follow-ups tested
[ ] Product CRUD tested
[ ] Inventory tested

[ ] Challan creation tested
[ ] Challan confirmation tested
[ ] Insufficient stock tested
[ ] Challan cancellation tested
[ ] Stock restoration tested

[ ] Challan PDF tested
[ ] Challan PDF status tested
[ ] Challan PDF product table tested
[ ] Challan PDF totals tested

[ ] Invoice page tested
[ ] Confirmed challan can generate invoice
[ ] Draft challan cannot generate invoice
[ ] Invoice number tested
[ ] Invoice customer information tested
[ ] Invoice product table tested
[ ] Invoice totals tested
[ ] Invoice status tested
[ ] Invoice PDF tested
[ ] Invoice PDF alignment tested
[ ] Invoice PDF filename tested
[ ] Invoice PDF visually differs from challan PDF

[ ] Dashboard tested
[ ] Dashboard analytics tested
[ ] Dashboard quick actions tested

[ ] Desktop UI tested
[ ] Mobile UI tested
[ ] Error states tested
[ ] Loading states tested
[ ] Empty states tested

[ ] Production frontend deployed
[ ] Production backend deployed
[ ] CORS configured
[ ] Environment variables configured

[ ] README updated
[ ] API documentation attached
[ ] Postman collection attached if required
[ ] GitHub repository is accessible
[ ] Test credentials documented
[ ] Live frontend URL documented
[ ] Live backend URL documented
[ ] Known limitations documented
```

---

# License

This project was created as part of a Full Stack Developer case-study/interview assignment.

---

# Acknowledgements

Built using the required case-study stack and modern React/Next.js development practices.

The implementation prioritizes:

- Clear business workflows
- Maintainable frontend architecture
- REST API integration
- Role-aware UX
- Transaction-safe backend operations
- Responsive UI
- Readability
- Operational usability
- Professional document generation
- Meaningful Git history
