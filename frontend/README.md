# FundsRoom — Frontend

A responsive, role-aware ERP/CRM operations frontend for a wholesale/distribution business. It provides a single admin-style interface for managing customers, products, inventory movements, sales challans, invoices, follow-ups, and operational dashboard data, integrating with a RESTful Node.js/Express backend via JWT authentication and PostgreSQL.

> **Stack:** Next.js / React / TypeScript / Tailwind CSS / shadcn-style UI · **Backend consumed:** Node.js / Express (see [`backend/README.md`](../backend/README.md) for the stack note) · **Auth:** JWT + role-based authorization

## Project Overview

The frontend is the employee-facing interface for: authentication and role-based access, customer CRM and follow-ups, product and inventory management with movement history, sales challans (full lifecycle, stock-aware confirmation, cancellation with stock restoration), Challan PDF export, invoice generation from confirmed challans with Invoice PDF export, an operational dashboard with low-stock visibility, and responsive role-aware administration. It's designed around real business workflows rather than disconnected CRUD screens.

## Features

**Authentication** — JWT-based login, persistent session, role-aware navigation, protected dashboard routes, logout, UI-level authorization checks. The backend remains the authoritative security boundary.

**Landing Page** — a public FundsRoom landing page at `/` (branding, description, login CTA) rather than an immediate redirect to `/login`.

**Customer CRM** — listing, search, pagination, create, edit, details, follow-up notes/history, role-aware actions, loading/empty/error states. Fields: name, mobile, email, business name, GST number, type (Retail / Wholesale / Distributor), address, status (Lead / Active / Inactive), follow-up date, notes.

**Product Management** — listing, search/filtering, pagination, create, edit, SKU/category/unit price/current stock/minimum stock threshold/warehouse location, low-stock visibility.

**Inventory Management** — current stock visibility, movement history, IN/OUT movements, product & movement-type filtering, pagination, quantity/reason/creator/timestamp per movement.

**Sales Challans** — listing, search/filtering, pagination, customer selection, multi-product line items with quantities, automatic challan numbering, Draft/Confirmed/Cancelled status, product snapshots, totals, creator info, confirm/cancel workflows, stock-aware confirmation, Challan PDF export, and invoice generation once confirmed.

## Roles and Permissions

| Role      | Primary Responsibility                          |
| --------- | ----------------------------------------------- |
| ADMIN     | Full operational access                         |
| SALES     | Customers, follow-ups, sales challans, invoices |
| WAREHOUSE | Products and inventory operations               |
| ACCOUNTS  | Financial/operational visibility                |

```ts
const canManage = user?.role === "ADMIN" || user?.role === "SALES";
```

Frontend permissions control presentation and UX only. Every protected API operation is independently authorized by the backend.

## Technology Stack

**Frontend:** Next.js · React · TypeScript · Tailwind CSS · shadcn-style UI · Lucide React icons · Axios · TanStack Query · jsPDF + jspdf-autotable
**Backend (consumed):** Node.js · Express.js · REST APIs · JWT
**Database:** PostgreSQL
**Deployment:** Vercel (alternatives: Netlify, Render Static Site) · AWS is optional/bonus only

## Architecture

```text
Browser
   │
   ▼
Next.js / React UI
   │
   ├── Hooks ──────────┐
   │                    │
   └── UI Components ───┤
                         ▼
                  API Client Layer (Axios)
                         │
                         ▼
                  REST Backend APIs
                         │
                         ▼
                    PostgreSQL
```

**Authentication flow:** login credentials → `POST /auth/login` → backend validates → JWT returned → frontend stores authenticated state → protected requests carry `Authorization: Bearer <token>`.

**PDF workflow:**

```text
Confirmed Challan
   ├──► Challan PDF   (challanPdf.ts)
   └──► Invoice Page  (/invoices/[challan]) ──► Invoice PDF (invoicePdf.ts)
```

## Application Flow

```text
/  (Landing) → /login → LoginForm → POST /auth/login → /dashboard

Customers:  List → Search / Create / Edit / Details → Follow-up history / Add follow-up
Inventory:  Current stock → Movement history → IN / OUT
Challans:   List → Create Draft (customer + products + quantities) → Details
                → Download Challan PDF
                → Confirm  (stock check → deduct → OUT movement)
                → Cancel   (draft: no-op | confirmed: restore stock + IN movement)
                → Generate Invoice → Invoice Page → Download Invoice PDF
```

## Folder Structure

```text
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── challans/{[id], new}/page.tsx
│   │   │   ├── customers/{[id]/edit, new}/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── inventory/page.tsx
│   │   │   ├── invoices/[challan]/page.tsx
│   │   │   ├── products/{[id]/edit, new}/page.tsx
│   │   │   └── layout.tsx
│   │   ├── login/page.tsx
│   │   └── layout.tsx, page.tsx, globals.css
│   ├── components/       auth/, challans/, common/, customers/, dashboard/, inventory/, layout/, products/, ui/
│   ├── hooks/             useAuth.ts, useChallans.ts, useCustomers.ts, useDashboard.ts, useInventory.ts, useProducts.ts
│   ├── lib/
│   │   ├── api/            auth.ts, challans.ts, client.ts, customers.ts, dashboard.ts, inventory.ts, products.ts
│   │   ├── auth/            permissions.ts, storage.ts
│   │   ├── pdf/             challanPdf.ts, invoicePdf.ts
│   │   └── query/queryKeys.ts, utils.ts
│   ├── providers/          AuthProvider.tsx, QueryProvider.tsx
│   ├── schemas/             challan.schema.ts, customer.schema.ts, inventory.schema.ts, product.schema.ts
│   └── types/                auth.ts, challan.ts, customer.ts, dashboard.ts, inventory.ts, product.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Important Files

| File                                              | Purpose                                                                                                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/page.tsx`                                | Public landing page                                                                                                                                                             |
| `src/app/(dashboard)/layout.tsx`                  | Authenticated app shell (nav + shared UI)                                                                                                                                       |
| `src/app/(dashboard)/dashboard/page.tsx`          | KPI cards, analytics, pipeline, inventory health, quick actions                                                                                                                 |
| `src/app/(dashboard)/invoices/[challan]/page.tsx` | Invoice presentation, metadata, billing info, totals, Download Invoice PDF                                                                                                      |
| `src/hooks/useAuth.ts`                            | Access the authenticated user and role                                                                                                                                          |
| `src/hooks/useCustomers.ts`                       | Customer CRUD + follow-ups                                                                                                                                                      |
| `src/hooks/useProducts.ts`                        | Product CRUD                                                                                                                                                                    |
| `src/hooks/useInventory.ts`                       | Stock movement operations                                                                                                                                                       |
| `src/hooks/useChallans.ts`                        | List/fetch/create/confirm/cancel challans                                                                                                                                       |
| `src/hooks/useDashboard.ts`                       | Dashboard summary data                                                                                                                                                          |
| `src/lib/pdf/challanPdf.ts`                       | Generates the Sales Challan PDF (header, metadata, customer, product table, totals, footer). Example filename: `Admin_User_SC-000009.pdf`                                       |
| `src/lib/pdf/invoicePdf.ts`                       | Generates the A4 Tax Invoice PDF (title/number, status, Bill From/To, product table, subtotal/grand total, footer, page numbers). Example filename: `Admin_User_INV-000010.pdf` |

## API Integration

A centralized API layer (`src/lib/api/*`) sits between hooks and Axios so UI components stay focused on presentation:

```text
React Page → Custom Hook → API Client (Axios) → Express REST API → PostgreSQL
```

```text
Authentication      POST /auth/login · GET /auth/me
Customers           GET/POST /customers · GET/PATCH /customers/:id
                     GET/POST /customers/:id/follow-ups
Products             GET/POST /products · GET/PATCH /products/:id
Inventory            GET /inventory · POST /inventory/movements
Challans             GET/POST /challans · GET /challans/:id
                     POST /challans/:id/confirm · POST /challans/:id/cancel
Dashboard            GET /dashboard
```

Invoices are derived from `GET /challans/:id` client-side — there is no separate invoice API (see [Invoice Generation and PDF Export](#invoice-generation-and-pdf-export)). The API base URL is configured through an environment variable so the route prefix can be adjusted per deployment.

## Authentication and Role-Based Access

Login submits email/password to the backend, which returns the authenticated user and a JWT. Protected requests attach `Authorization: Bearer <JWT>`. UI actions (creating customers, creating/confirming/cancelling challans, etc.) are conditionally rendered by role, but the backend independently validates every permission.

## Sales Challans and the Challan Lifecycle

A challan can hold multiple products:

```text
Customer: ABC Traders
Product       SKU        Qty    Price
Monitor       MON-001    5      18500
Keyboard      KEY-001    5      1200
Mouse         MOU-001    5      800
Total Quantity: 15   Total Amount: ₹102,500
```

Each item stores `productNameSnapshot`, `skuSnapshot`, `unitPriceSnapshot` — so later product edits never change the meaning of a historical challan or its invoice.

```text
DRAFT ── Cancel ──► CANCELLED
DRAFT ── Confirm ──► validate stock → deduct stock → create OUT movement ──► CONFIRMED
CONFIRMED ── Cancel ──► restore stock → create IN movement ──► CANCELLED
```

If stock is insufficient, the backend returns an error and the frontend surfaces it — it never pretends the confirmation succeeded.

## Challan PDF Export

Generated with jsPDF + jspdf-autotable. Contains: FundsRoom header, "Sales Challan" title, challan number, created/updated dates, status, customer & business, created-by + role, a line-item table (product/SKU/qty/unit price/amount), totals, generated timestamp, footer.

**Filename:** `<CreatedBy>_<ChallanNumber>.pdf` — e.g. `Admin_User_SC-000009.pdf` (sanitized to remove unsupported characters).

## Invoice Generation and PDF Export

FundsRoom supports generating a billing invoice from a confirmed sales challan.

**Workflow:**

```text
Sales Challan (DRAFT) → Confirm (stock validated, deducted, OUT movement) → CONFIRMED
   → Generate Invoice → /invoices/[challan] → Download Invoice PDF
```

**Eligibility** — only CONFIRMED challans can generate an invoice, since a draft's inventory transaction hasn't completed:

```ts
if (challan.status === "CONFIRMED") {
  // Generate invoice
}
```

**Invoice Page (`/invoices/[challan]`)** — invoice title/number, reference challan, customer & billing info, product table, totals, status, created-by, a Download Invoice PDF button, and back-to-challan navigation.

**Invoice Numbering** — derived directly from the source challan, e.g. `SC-000010` → `INV-000010`.

**Invoice PDF** — generated client-side with jsPDF + jspdf-autotable on a structured A4 layout, visually distinct from the challan PDF:

```text
FUNDSROOM · ERP & Business Operations
TAX INVOICE · INV-000010 · CONFIRMED

BILL FROM                    BILL TO
FundsRoom                     Customer Name
ERP & Business Operations     Business Name

# | Description | SKU | Qty | Unit Price | Amount
                     Total Quantity     15
                     Subtotal           INR 102,500.00
                     Grand Total        INR 102,500.00
```

Numeric columns (Qty, Unit Price, Amount) are right-aligned; SKU is centered; Description is left-aligned. Footer includes document identification and page numbering. **Filename:** `<CreatedBy>_<InvoiceNumber>.pdf` — e.g. `Admin_User_INV-000010.pdf`.

**Invoice API Architecture** — there is intentionally no separate invoice CRUD API. The invoice page reuses `GET /challans/:id`; the confirmed challan remains the single source of truth, and invoice generation performs no inventory mutation:

```text
GET /challans/:id → Confirmed Challan → Invoice Page → Client-side PDF generator → Download
```

**Challan vs. Invoice**

|            | Sales Challan                                  | Invoice                                         |
| ---------- | ---------------------------------------------- | ----------------------------------------------- |
| Represents | Physical dispatch transaction                  | Billing document                                |
| Focus      | Customer, products, quantities, stock movement | Billing, pricing, totals, transaction reference |
| Example    | `SALES CHALLAN · SC-000010`                    | `TAX INVOICE · INV-000010`                      |

The two documents are visually distinct but traceably linked via the challan number.

## Dashboard

**KPI cards:** Customers · Products · Stock Units · Challans
**Customer analytics:** total, active, leads, active %, lead %, donut visualization
**Challan analytics:** total, confirmed, draft, cancelled, confirmation %, status bars
**Inventory health:** total stock units, tracked products, low-stock products, stock-health visualization
**Views:** Overview · Sales · Customers
**Quick actions:** Add Customer · Add Product · View Inventory · Create Challan

## Validation, Errors and HTTP Status Handling

The UI handles loading states, empty results, mutation errors, unauthorized actions, failed confirmations/cancellations, insufficient-stock responses, and retries — it never fails silently.

| Status    | Meaning                        |
| --------- | ------------------------------ |
| 200 / 201 | Successful operation           |
| 400       | Validation / malformed request |
| 401       | Unauthenticated                |
| 403       | Unauthorized                   |
| 404       | Resource not found             |
| 409       | Business rule conflict         |
| 500       | Unexpected server error        |

The backend response contract is the source of truth; the frontend just consumes and surfaces it.

## Responsive UI and Design System

Responsive tables, mobile-friendly forms, flexible action buttons, responsive dashboard grids, stacked sections on small screens, responsive PDF action placement, touch-friendly controls. Visual language: slate-based neutral surfaces, white content cards, subtle borders, rounded corners, consistent spacing, Lucide icons, clear typography hierarchy, colored status indicators, minimal visual noise — readability first.

## Environment Variables

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Production:

```env
NEXT_PUBLIC_API_URL=https://fundsroom-backend-9xiy.onrender.com/api
```

Do not commit real secrets — use `.env.example` with placeholder values only.

## Local Development

Prerequisites: Node.js, npm, Git, and (for a real backend) the FundsRoom backend + PostgreSQL running.

```bash
npm install
# create .env.local with NEXT_PUBLIC_API_URL
npm run dev        # http://localhost:3000
```

## Production Build & Deployment

```bash
npm run build
npm start
```

Always verify the production build before deploying — it catches production-only compilation/rendering issues. Frontend hosting: Vercel (deployed), alternatives Netlify / Render Static Site. Backend/database: see [`backend/README.md`](../backend/README.md). Set `NEXT_PUBLIC_API_URL` in the hosting platform's environment settings. The backend must allow the deployed frontend origin through CORS (configured server-side, not with a wildcard in production).

## Role-Based QA Matrix

| Feature                             | ADMIN | SALES | WAREHOUSE | ACCOUNTS |
| ----------------------------------- | :---: | :---: | :-------: | :------: |
| Login / Dashboard                   |   ✓   |   ✓   |     ✓     |    ✓     |
| Customer Read                       |   ✓   |   ✓   |     ✓     |    ✓     |
| Customer Create / Edit / Follow-ups |   ✓   |   ✓   |     —     |    —     |
| Product Read                        |   ✓   |   ✓   |     ✓     |    ✓     |
| Product Create / Edit               |   ✓   |   —   |     ✓     |    —     |
| Inventory Read                      |   ✓   |   ✓   |     ✓     |    ✓     |
| Inventory Operations                |   ✓   |   —   |     ✓     |    —     |
| Challan Read                        |   ✓   |   ✓   |     ✓     |    ✓     |
| Challan Create / Confirm / Cancel   |   ✓   |   ✓   |     —     |    —     |
| Challan PDF                         |   ✓   |   ✓   |     ✓     |    ✓     |
| Invoice View / PDF                  |   ✓   |   ✓   |     ✓     |    ✓     |

The exact authorization must always match the backend's implemented policy — see [`backend/API_DOCS.md`](../backend/API_DOCS.md).

## Git Workflow

Small, meaningful commits, e.g.: `feat: add authentication flow`, `feat: add customer management`, `feat: add inventory management`, `feat: add challan lifecycle workflow`, `feat: add challan PDF export`, `feat: add invoice generation and PDF export`, `feat: enhance dashboard with interactive analytics`.

## Submission Information

| Item              | Value                                                  |
| ----------------- | ------------------------------------------------------ |
| GitHub Repository | _(add your repository URL here)_                       |
| Live Frontend     | https://funds-room-mini-erp-crm-operations.vercel.app/ |
| Live Backend      | https://fundsroom-backend-9xiy.onrender.com/           |
| API Documentation | [`backend/API_DOCS.md`](../backend/API_DOCS.md)        |
| Test Credentials  | See root [`README.md`](../README.md#test-credentials)  |

## Business Logic Principles

Stock cannot go negative — enforced server-side; the frontend only displays the resulting error. Challan confirmation is transactional — confirmed status + deducted stock + OUT movement all succeed together, or none do. Challan cancellation restores confirmed stock via compensating IN movements, preserving the audit trail. Historical product information is preserved via snapshot fields on every challan item. Invoices are derived, not independent — an invoice always traces back to exactly one confirmed challan and never mutates stock.

## Assumptions

The backend is the authoritative source for business rules. JWT authentication protects all non-public APIs. PostgreSQL is the persistence layer; Prisma-backed API contracts are provided by the backend. Challan product snapshots are persisted server-side. Dashboard values come from the dashboard aggregate API. Both challan and invoice PDF generation happen entirely client-side and are not persisted server-side. Frontend role checks improve UX but never replace backend authorization. Production CORS is configured server-side to allow the deployed frontend origin.

## Known Limitations

- **Historical analytics** — only aggregate, current-state data is shown; no revenue/stock/customer trend history (would need dedicated backend aggregation endpoints).
- **PDF storage** — challan and invoice PDFs are generated in-browser and downloaded locally, not persisted to cloud storage.
- **Product images** — AWS S3 upload is an optional bonus and is not implemented.
- **Advanced ERP modules** — purchase orders, purchase returns, credit/debit notes, payment collection, AR/AP, GST filing, and advanced accounting are out of scope.

## Future Improvements

**Analytics:** revenue/sales/stock-movement trend charts, customer growth, top-selling products
**Product images:** AWS S3 / Cloudinary
**Notifications:** low-stock, challan confirmation, follow-up reminders
**Search:** global search, advanced/saved filters
**Reporting:** sales/inventory/customer/invoice reports, CSV/XLSX export
**Invoicing:** server-side persistence, invoice history/search, GST/tax breakdown, discounts, payment status, due dates, credit notes, email delivery, cloud PDF storage
**DevOps:** Docker, GitHub Actions, automated deployment, CI checks

## License

Created as part of a Full Stack Developer case-study / interview assignment.
