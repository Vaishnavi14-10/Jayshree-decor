import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices, deleteInvoice, updateStatus } from '../utils/api';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = () => {
    getInvoices()
      .then(r => { setInvoices(r.data); setFiltered(r.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let data = invoices;
    if (statusFilter !== 'all') data = data.filter(i => i.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(i =>
        i.invoice_number.toLowerCase().includes(q) ||
        i.client_name.toLowerCase().includes(q) ||
        i.event_type?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [search, statusFilter, invoices]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    await deleteInvoice(id);
    load();
  };

  const handleStatus = async (id, status) => {
    await updateStatus(id, status);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>All Invoices</h1>
          <p>{filtered.length} invoice{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/invoices/new" className="btn btn-primary">+ New Invoice</Link>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input
            placeholder="Search by party name, invoice #, event..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: '1px solid #ddd', borderRadius: 8, padding: '9px 12px', fontSize: 14 }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: '9px 12px', fontSize: 14 }}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', padding: 24 }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: 24 }}>No invoices found.</p>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Party Name</th>
                <th>Phone</th>
                <th>Event</th>
                <th>Invoice Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600, color: '#1a1a2e' }}>{inv.invoice_number}</td>
                  <td>{inv.client_name}</td>
                  <td style={{ color: '#888' }}>{inv.client_phone || '-'}</td>
                  <td>{inv.event_type}</td>
                  <td>{new Date(inv.invoice_date).toLocaleDateString('en-IN')}</td>
                  <td style={{ fontWeight: 700 }}>{fmt(inv.grand_total)}</td>
                  <td>
                    <select
                      value={inv.status}
                      onChange={e => handleStatus(inv.id, e.target.value)}
                      style={{
                        border: '1px solid #e0e0e0', borderRadius: 6, padding: '4px 8px', fontSize: 12,
                        background: inv.status === 'paid' ? '#dcfce7' : inv.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                        color: inv.status === 'paid' ? '#16a34a' : inv.status === 'cancelled' ? '#dc2626' : '#d97706',
                        fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/invoices/${inv.id}`} className="btn btn-sm">View</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(inv.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
