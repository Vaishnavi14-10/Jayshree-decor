# Jayshree Decor — Invoice Management System
> Full-stack Invoice System | React + Node.js + PostgreSQL

---

## Project Structure

```
jayshree-decor/
├── backend/          ← Node.js + Express API
│   ├── src/
│   │   ├── index.js          ← Server entry point
│   │   ├── db.js             ← PostgreSQL connection & DB setup
│   │   └── routes/
│   │       └── invoices.js   ← All invoice API routes
│   ├── .env.example
│   └── package.json
│
└── frontend/         ← React app
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js            ← Routes & sidebar layout
    │   ├── index.js          ← React entry
    │   ├── index.css         ← Global styles
    │   ├── pages/
    │   │   ├── Dashboard.js      ← Stats & recent invoices
    │   │   ├── InvoiceList.js    ← All invoices with search/filter
    │   │   ├── NewInvoice.js     ← Create invoice form
    │   │   └── InvoiceDetail.js  ← View & print invoice
    │   └── utils/
    │       └── api.js            ← Axios API calls
    └── package.json
```

---

## Setup Instructions

### Step 1 — PostgreSQL Database

Make sure PostgreSQL is installed and running on your machine.

```sql
-- Open psql and run:
CREATE DATABASE jayshree_decor;
```

The app will auto-create the tables (`clients`, `invoices`, `invoice_items`) on first run.

---

### Step 2 — Backend Setup

```bash
cd backend

# Copy and fill in your DB credentials
cp .env.example .env
# Edit .env with your PostgreSQL password

# Install dependencies
npm install

# Start server (development)
npm run dev

# OR start server (production)
npm start
```

Backend runs at: **http://localhost:5000**

#### .env file:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jayshree_decor
DB_USER=postgres
DB_PASSWORD=your_password_here
```

---

### Step 3 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend runs at: **http://localhost:3000**

> The `"proxy": "http://localhost:5000"` in frontend/package.json automatically proxies API requests to the backend.

---

## Features

| Feature | Description |
|---|---|
| Dashboard | Total invoices, revenue, paid/unpaid amounts |
| New Invoice | Party name, phone, venue, event type, date |
| Line Items | Category (Props / Menu Board / Display / Dessert / Lighting / Floral etc.), description, qty, rate |
| Auto Totals | Subtotal, discount %, GST/tax %, grand total |
| Payment Status | Mark as Paid / Unpaid / Cancelled |
| Search & Filter | Search by party name, invoice number, event |
| Print Invoice | Professional printable PDF-ready invoice |
| PostgreSQL | Persistent storage with proper relational tables |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/invoices | List all invoices |
| GET | /api/invoices/:id | Get single invoice with items |
| POST | /api/invoices | Create new invoice |
| PATCH | /api/invoices/:id/status | Update payment status |
| DELETE | /api/invoices/:id | Delete invoice |
| GET | /api/invoices/meta/next-number | Get next invoice number |
| GET | /api/invoices/meta/stats | Dashboard statistics |

---

## Tech Stack

- **Frontend**: React 18, React Router 6, Axios, react-to-print
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (with `pg` driver)
- **Print**: react-to-print for browser-native printing
