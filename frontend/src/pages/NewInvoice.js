import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNextNumber, createInvoice } from '../utils/api';

const CATEGORIES = ['Props', 'Menu Board', 'Display', 'Dessert', 'Lighting', 'Floral', 'Stage Setup', 'Sound & DJ', 'Photography', 'Other'];
const EVENT_TYPES = ['Wedding', 'Reception', 'Engagement', 'Birthday', 'Anniversary', 'Corporate', 'Other'];

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

let itemId = 1;
const newItem = () => ({ _id: itemId++, category: 'Props', description: '', quantity: 1, rate: 0, amount: 0 });

export default function NewInvoice() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
    event_date: '',
    client_name: '',
    client_phone: '',
    client_address: '',
    event_type: 'Wedding',
    discount_percent: 0,
    tax_percent: 0,
    notes: '',
    status: 'unpaid',
  });

  const [items, setItems] = useState([newItem()]);

  useEffect(() => {
    getNextNumber().then(r => setForm(f => ({ ...f, invoice_number: r.data.invoice_number })));
  }, []);

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const updateItem = (id, key, val) => {
    setItems(prev => prev.map(item => {
      if (item._id !== id) return item;
      const updated = { ...item, [key]: val };
      if (key === 'quantity' || key === 'rate') {
        updated.amount = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.rate) || 0);
      }
      return updated;
    }));
  };

  const addItem = () => setItems(prev => [...prev, newItem()]);
  const removeItem = (id) => setItems(prev => prev.filter(i => i._id !== id));

  const subtotal = items.reduce((s, i) => s + (parseFloat(i.quantity) || 0) * (parseFloat(i.rate) || 0), 0);
  const discountAmt = subtotal * ((parseFloat(form.discount_percent) || 0) / 100);
  const afterDisc = subtotal - discountAmt;
  const taxAmt = afterDisc * ((parseFloat(form.tax_percent) || 0) / 100);
  const grandTotal = afterDisc + taxAmt;

  const handleSubmit = async () => {
    if (!form.client_name.trim()) return setError('Party / client name is required.');
    if (items.length === 0) return setError('Add at least one item.');
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        subtotal,
        discount_amount: discountAmt,
        tax_amount: taxAmt,
        grand_total: grandTotal,
        items: items.map(({ _id, ...i }) => ({
          ...i,
          quantity: parseFloat(i.quantity) || 0,
          rate: parseFloat(i.rate) || 0,
          amount: (parseFloat(i.quantity) || 0) * (parseFloat(i.rate) || 0),
        })),
      };
      const res = await createInvoice(payload);
      navigate(`/invoices/${res.data.id}`);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to save invoice.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>New Invoice</h1>
          <p>Fill in the details below to generate an invoice</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Invoice Meta */}
      <div className="card">
        <div className="card-title">Invoice Details</div>
        <div className="form-grid form-grid-3">
          <div className="form-group">
            <label>Invoice Number</label>
            <input value={form.invoice_number} onChange={e => setField('invoice_number', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Invoice Date</label>
            <input type="date" value={form.invoice_date} onChange={e => setField('invoice_date', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Event Date</label>
            <input type="date" value={form.event_date} onChange={e => setField('event_date', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="card">
        <div className="card-title">Party / Client Information</div>
        <div className="form-grid form-grid-2" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <label>Party / Client Name *</label>
            <input placeholder="e.g. Sharma Family" value={form.client_name} onChange={e => setField('client_name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input placeholder="+91 98765 43210" value={form.client_phone} onChange={e => setField('client_phone', e.target.value)} />
          </div>
        </div>
        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label>Venue / Address</label>
            <input placeholder="Wedding hall or address" value={form.client_address} onChange={e => setField('client_address', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Event Type</label>
            <select value={form.event_type} onChange={e => setField('event_type', e.target.value)}>
              {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card">
        <div className="card-title">Items / Services</div>
        <table className="items-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Category</th>
              <th style={{ width: '32%' }}>Description</th>
              <th style={{ width: '12%' }}>Qty</th>
              <th style={{ width: '16%' }}>Rate (₹)</th>
              <th style={{ width: '16%' }}>Amount (₹)</th>
              <th style={{ width: '4%' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td>
                  <select value={item.category} onChange={e => updateItem(item._id, 'category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </td>
                <td>
                  <input placeholder="Description" value={item.description} onChange={e => updateItem(item._id, 'description', e.target.value)} />
                </td>
                <td>
                  <input type="number" min="1" value={item.quantity} onChange={e => updateItem(item._id, 'quantity', e.target.value)} />
                </td>
                <td>
                  <input type="number" min="0" value={item.rate} onChange={e => updateItem(item._id, 'rate', e.target.value)} />
                </td>
                <td>
                  <input readOnly value={((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)} style={{ background: '#f9fafb', color: '#555' }} />
                </td>
                <td>
                  <button onClick={() => removeItem(item._id)} style={{ background: '#fef2f2', border: 'none', borderRadius: 6, padding: '6px 9px', cursor: 'pointer', color: '#dc2626', fontSize: 16 }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn" style={{ marginTop: 10, borderStyle: 'dashed' }} onClick={addItem}>+ Add Item</button>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div className="form-group">
                <label>Discount (%)</label>
                <input type="number" min="0" max="100" value={form.discount_percent} onChange={e => setField('discount_percent', e.target.value)} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '8px 10px', fontSize: 14 }} />
              </div>
              <div className="form-group">
                <label>Tax / GST (%)</label>
                <input type="number" min="0" value={form.tax_percent} onChange={e => setField('tax_percent', e.target.value)} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '8px 10px', fontSize: 14 }} />
              </div>
            </div>
            <div className="totals-box">
              <div className="totals-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="totals-row"><span>Discount ({form.discount_percent}%)</span><span>- {fmt(discountAmt)}</span></div>
              <div className="totals-row"><span>Tax / GST ({form.tax_percent}%)</span><span>+ {fmt(taxAmt)}</span></div>
              <div className="totals-row grand"><span>Total</span><span>{fmt(grandTotal)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Status */}
      <div className="card">
        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label>Notes</label>
            <textarea rows={3} placeholder="Advance paid, return date for props, special instructions..." value={form.notes} onChange={e => setField('notes', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Payment Status</label>
            <select value={form.status} onChange={e => setField('status', e.target.value)}>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn" onClick={() => navigate('/invoices')}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Invoice'}
        </button>
      </div>
    </div>
  );
}
