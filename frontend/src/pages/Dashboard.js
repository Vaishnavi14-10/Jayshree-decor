import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getInvoices } from '../utils/api';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getInvoices()])
      .then(([s, inv]) => {
        setStats(s.data);
        setRecent(inv.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '40px', color: '#888' }}>Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back — Jayshree Decor</p>
        </div>
        <Link to="/invoices/new" className="btn btn-primary">+ New Invoice</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="label">Total Invoices</div>
          <div className="value">{stats?.total_invoices || 0}</div>
        </div>
        <div className="stat-card gold">
          <div className="label">Total Revenue</div>
          <div className="value" style={{ fontSize: '18px' }}>{fmt(stats?.total_revenue || 0)}</div>
        </div>
        <div className="stat-card green">
          <div className="label">Paid Amount</div>
          <div className="value" style={{ fontSize: '18px' }}>{fmt(stats?.paid_amount || 0)}</div>
        </div>
        <div className="stat-card red">
          <div className="label">Unpaid Amount</div>
          <div className="value" style={{ fontSize: '18px' }}>{fmt(stats?.unpaid_amount || 0)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Invoices</div>
        {recent.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '24px' }}>No invoices yet. <Link to="/invoices/new">Create your first invoice</Link></p>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Party Name</th>
                <th>Event</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recent.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600 }}>{inv.invoice_number}</td>
                  <td>{inv.client_name}</td>
                  <td>{inv.event_type}</td>
                  <td>{new Date(inv.invoice_date).toLocaleDateString('en-IN')}</td>
                  <td style={{ fontWeight: 600 }}>{fmt(inv.grand_total)}</td>
                  <td><span className={`badge badge-${inv.status}`}>{inv.status}</span></td>
                  <td><Link to={`/invoices/${inv.id}`} className="btn btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
