import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { getInvoice, updateStatus, deleteInvoice } from '../utils/api';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

function PrintableInvoice({ invoice }) {
  const { items = [] } = invoice;
  return (
    <div style={{ padding: 32, fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#222', maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #1a1a2e' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e' }}>Jayshree Decor</div>
          <div style={{ fontSize: 11, color: '#777', marginTop: 3 }}>Wedding & Event Decoration | Props · Menu Boards · Display · Dessert</div>
          <div style={{ fontSize: 11, color: '#777', marginTop: 2 }}>Ahmedabad, Gujarat</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>INVOICE</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>No: <strong>{invoice.invoice_number}</strong></div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Date: {fmtDate(invoice.invoice_date)}</div>
          <div style={{ marginTop: 8 }}>
            <span style={{
              display: 'inline-block', padding: '3px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700,
              background: invoice.status === 'paid' ? '#dcfce7' : invoice.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
              color: invoice.status === 'paid' ? '#16a34a' : invoice.status === 'cancelled' ? '#dc2626' : '#d97706',
            }}>
              {invoice.status?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Client + Event */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: 6 }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{invoice.client_name}</div>
          {invoice.client_phone && <div style={{ color: '#555', marginTop: 3 }}>☎ {invoice.client_phone}</div>}
          {invoice.client_address && <div style={{ color: '#555', marginTop: 2 }}>📍 {invoice.client_address}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: 6 }}>Event Details</div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{invoice.event_type}</div>
          {invoice.event_date && <div style={{ color: '#555', marginTop: 3 }}>Event Date: {fmtDate(invoice.event_date)}</div>}
        </div>
      </div>

      {/* Items table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#1a1a2e' }}>
            <th style={{ padding: '8px 10px', color: '#f7c948', fontWeight: 600, textAlign: 'left', width: 30 }}>#</th>
            <th style={{ padding: '8px 10px', color: '#f7c948', fontWeight: 600, textAlign: 'left' }}>Category</th>
            <th style={{ padding: '8px 10px', color: '#f7c948', fontWeight: 600, textAlign: 'left' }}>Description</th>
            <th style={{ padding: '8px 10px', color: '#f7c948', fontWeight: 600, textAlign: 'center' }}>Qty</th>
            <th style={{ padding: '8px 10px', color: '#f7c948', fontWeight: 600, textAlign: 'right' }}>Rate</th>
            <th style={{ padding: '8px 10px', color: '#f7c948', fontWeight: 600, textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee' }}>{i + 1}</td>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee' }}>
                <span style={{ background: '#eef', padding: '2px 7px', borderRadius: 4, fontSize: 11 }}>{item.category}</span>
              </td>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee' }}>{item.description || '-'}</td>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{fmt(item.rate)}</td>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 600 }}>{fmt(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <div style={{ minWidth: 240 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#555' }}>
            <span>Subtotal</span><span>{fmt(invoice.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#555' }}>
            <span>Discount ({invoice.discount_percent}%)</span><span>- {fmt(invoice.discount_amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#555' }}>
            <span>Tax / GST ({invoice.tax_percent}%)</span><span>+ {fmt(invoice.tax_amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 5px', fontSize: 16, fontWeight: 800, color: '#1a1a2e', borderTop: '2px solid #1a1a2e', marginTop: 6 }}>
            <span>Total</span><span>{fmt(invoice.grand_total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e' }}>
          <strong>Notes:</strong> {invoice.notes}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 28, paddingTop: 12, borderTop: '1px solid #eee', fontSize: 11, color: '#aaa', textAlign: 'center' }}>
        Thank you for choosing Jayshree Decor! &bull; Please return all props within the agreed timeframe &bull; Jayshree Decor, Ahmedabad, Gujarat
      </div>
    </div>
  );
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  const handlePrint = useReactToPrint({ content: () => printRef.current });

  useEffect(() => {
    getInvoice(id).then(r => setInvoice(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this invoice permanently?')) return;
    await deleteInvoice(id);
    navigate('/invoices');
  };

  const handleStatus = async (e) => {
    await updateStatus(id, e.target.value);
    setInvoice(inv => ({ ...inv, status: e.target.value }));
  };

  if (loading) return <div style={{ padding: 40, color: '#888' }}>Loading invoice...</div>;
  if (!invoice) return <div style={{ padding: 40, color: '#dc2626' }}>Invoice not found.</div>;

  return (
    <div>
      {/* Toolbar */}
      <div className="page-header no-print">
        <div>
          <Link to="/invoices" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>← Back to Invoices</Link>
          <h1 style={{ marginTop: 4 }}>{invoice.invoice_number}</h1>
          <p>{invoice.client_name} &bull; {invoice.event_type}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={invoice.status} onChange={handleStatus} style={{
            border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', fontSize: 13,
            background: '#fff', cursor: 'pointer'
          }}>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="btn btn-success" onClick={handlePrint}>🖨️ Print Invoice</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {/* Printable area */}
      <div ref={printRef} className="print-area card" style={{ padding: 0 }}>
        <PrintableInvoice invoice={invoice} />
      </div>
    </div>
  );
}
