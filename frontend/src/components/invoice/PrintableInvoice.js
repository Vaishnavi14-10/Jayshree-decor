import React from 'react';
import { fmtCurrency, fmtDate } from '../../utils/helpers';

const PrintableInvoice = React.forwardRef(({ invoice }, ref) => {
  if (!invoice) return null;
  const { items = [] } = invoice;

  return (
    <div ref={ref} style={{ padding: 36, fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#222', maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #1a1a2e' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e' }}>Jayshree Decor</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>Wedding & Event Decoration · Props · Menu Boards · Display · Dessert</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Ahmedabad, Gujarat</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>INVOICE</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>No: <strong>{invoice.invoiceNumber}</strong></div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Date: {fmtDate(invoice.invoiceDate)}</div>
          <div style={{ marginTop: 8 }}>
            <span style={{
              display: 'inline-block', padding: '3px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700,
              background: invoice.status === 'paid' ? '#dcfce7' : invoice.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
              color: invoice.status === 'paid' ? '#16a34a' : invoice.status === 'cancelled' ? '#dc2626' : '#d97706',
            }}>{invoice.status?.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Client + Event */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: 6 }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{invoice.client?.name}</div>
          {invoice.client?.phone    && <div style={{ color: '#555', marginTop: 3 }}>☎ {invoice.client.phone}</div>}
          {invoice.client?.address  && <div style={{ color: '#555', marginTop: 2 }}>📍 {invoice.client.address}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: 6 }}>Event Details</div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{invoice.eventType}</div>
          {invoice.eventDate && <div style={{ color: '#555', marginTop: 3 }}>Event Date: {fmtDate(invoice.eventDate)}</div>}
        </div>
      </div>

      {/* Items */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#1a1a2e' }}>
            {['#', 'Category', 'Description', 'Qty', 'Rate', 'Amount'].map((h, i) => (
              <th key={h} style={{ padding: '8px 10px', color: '#f7c948', fontWeight: 600, textAlign: i >= 3 ? 'right' : 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee' }}>{i + 1}</td>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee' }}>
                <span style={{ background: '#eef', padding: '2px 7px', borderRadius: 4, fontSize: 11 }}>{item.category}</span>
              </td>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee' }}>{item.description || '—'}</td>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{item.quantity}</td>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{fmtCurrency(item.rate)}</td>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 600 }}>{fmtCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <div style={{ minWidth: 240 }}>
          {[
            ['Subtotal', fmtCurrency(invoice.subtotal)],
            [`Discount (${invoice.discountPercent}%)`, `− ${fmtCurrency(invoice.discountAmount)}`],
            [`Tax / GST (${invoice.taxPercent}%)`, `+ ${fmtCurrency(invoice.taxAmount)}`],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12, color: '#555' }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 4px', fontSize: 16, fontWeight: 800, color: '#1a1a2e', borderTop: '2px solid #1a1a2e', marginTop: 6 }}>
            <span>Total</span><span>{fmtCurrency(invoice.grandTotal)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e' }}>
          <strong>Notes:</strong> {invoice.notes}
        </div>
      )}

      <div style={{ marginTop: 28, paddingTop: 12, borderTop: '1px solid #eee', fontSize: 11, color: '#aaa', textAlign: 'center' }}>
        Thank you for choosing Jayshree Decor! · Please return all props within the agreed timeframe · Ahmedabad, Gujarat
      </div>
    </div>
  );
});

PrintableInvoice.displayName = 'PrintableInvoice';
export default PrintableInvoice;
