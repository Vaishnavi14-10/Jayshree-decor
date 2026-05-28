# Jayshree Decor — Invoice Management System v2.0
> Production-grade Full-Stack App | React + Node.js + Express + Sequelize ORM + PostgreSQL

---

## Project Structure

```
jayshree-decor-v2/
├── backend/
├── config/                 - Sequelize CLI config
│   └── config.js
│
├── logs/                   - Winston auto-creates this
│
├── migrations/             - schema version control
│   ├── 20240001000000-create-clients.js
│   ├── 20240002000000-create-invoices.js
│   └── 20240003000000-create-invoice-items.js
│
├── seeders/                - demo/test data
│   └── 20240004000000-demo-data.js
│
├── src/
│   ├── config/           
│   │   ├── database.js    ← Sequelize env config
│   │   └── sequelize.js   ← DB connection instance
│   │
│   ├── controllers/       - business logic lives here
│   ├── middlewares/       - errorHandler, validate, notFound
│   ├── models/            - Sequelize models
│   ├── routes/            - API route definitions
│   ├── utils/             - logger, response helpers
│   ├── validations/       - express-validator rules
│   │
│   └── index.js           - Express server entry point
│
├── .env                   
├── .env.example           
├── .gitignore            
├── .sequelizerc           
└── package.json          
|
│
└── frontend/
└── src/
    ├── theme/
    │   └── index.js               ← MUI theme (brand colors, typography, component overrides)
    │
    ├── components/
    │   ├── common/                ← Reusable across all pages
    │   │   ├── StatusChip.js      ← Paid/Unpaid/Partial/Cancelled badge
    │   │   ├── PageHeader.js      ← Title + subtitle + action button
    │   │   ├── StatCard.js        ← Dashboard metric cards
    │   │   ├── ConfirmDialog.js   ← Delete confirmation modal
    │   │   ├── LoadingScreen.js   ← Spinner with message
    │   │   └── index.js           ← Barrel export
    │   │
    │   ├── invoice/               ← Invoice-specific components
    │   │   ├── InvoiceItemsTable.js  ← Line items editor (shared by New + Edit)
    │   │   ├── TotalsSummary.js      ← Discount/Tax/Total calculator
    │   │   ├── PrintableInvoice.js   ← Print-ready invoice layout
    │   │   └── index.js
    │   │
    │   └── layout/
    │       ├── Sidebar.js         ← MUI Drawer navigation
    │       └── MainLayout.js      ← Page wrapper with sidebar
    │
    ├── hooks/
    │   └── useInvoices.js         ← useInvoices, useStats, useInvoice, useNextNumber
    │
    ├── pages/
    │   ├── Dashboard.js           ← Stats + chart + recent invoices
    │   ├── InvoiceList.js         ← Table with search, filter, pagination
    │   ├── InvoiceForm.js         ← Shared form (used by New + Edit)
    │   ├── NewInvoice.js          ← Thin wrapper around InvoiceForm
    │   ├── EditInvoice.js         ← Loads data, then uses InvoiceForm
    │   ├── InvoiceDetail.js       ← View + print + status change
    │   └── Clients.js             ← Client directory
    │
    └── utils/
        ├── api.js                 ← Axios with interceptors
        └── helpers.js             ← fmtCurrency, fmtDate, calcTotals, constants
```

---

## Quick Setup

### Step 1 — PostgreSQL

```sql
-- In psql or pgAdmin:
CREATE DATABASE jayshree_decor;
```

### Step 2 — Backend

```bash
cd backend
cp .env.example .env        # Edit DB_PASSWORD with your PostgreSQL password
npm install
npm run dev                 # Development (auto-reload)
npm start                   # Production
```

Tables are auto-created on first run via Sequelize sync.

### Step 3 — Frontend

```bash
cd frontend
npm install
npm start
```

Open **http://localhost:3000**

---

## .env Reference

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=jayshree_decor
DB_USER=postgres
DB_PASSWORD=your_password

CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200

LOG_LEVEL=info
LOG_DIR=logs
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/invoices | List invoices (search, filter, paginate) |
| POST | /api/invoices | Create invoice |
| GET | /api/invoices/:id | Get single invoice with items |
| PUT | /api/invoices/:id | Update full invoice |
| PATCH | /api/invoices/:id/status | Update status only |
| DELETE | /api/invoices/:id | Delete invoice |
| GET | /api/invoices/meta/stats | Dashboard stats + monthly revenue |
| GET | /api/invoices/meta/next-number | Auto-generate next invoice number |
| GET | /api/clients | List/search clients |
| GET | /api/clients/:id/invoices | All invoices for a client |

---

## Production Features

| Feature | Detail |
|---|---|
| ORM | Sequelize v6 with model-level validations & associations |
| Security | Helmet (HTTP headers), CORS, Rate limiting |
| Validation | express-validator on all routes, server-side total recalculation |
| Logging | Winston with daily-rotate-file (error + combined logs) |
| Error Handling | Global handler for Sequelize errors, validation errors, 404s |
| Transactions | All invoice creates/updates use DB transactions with rollback |
| Pagination | Server-side pagination with total count |
| Graceful Shutdown | SIGTERM/SIGINT handlers, unhandledRejection logging |
| Connection Pooling | Configurable via env vars |
