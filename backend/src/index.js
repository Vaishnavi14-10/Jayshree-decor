const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./db');
const invoiceRoutes = require('./routes/invoices');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/invoices', invoiceRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Jayshree Decor API' }));

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Jayshree Decor API running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to initialize DB:', err.message);
  process.exit(1);
});
