export const fmtCurrency = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export const fmtDateInput = (d) =>
  d ? new Date(d).toISOString().split('T')[0] : '';

export const calcTotals = (items = [], discountPercent = 0, taxPercent = 0) => {
  const subtotal      = items.reduce((s, i) => s + (parseFloat(i.quantity) || 0) * (parseFloat(i.rate) || 0), 0);
  const discountAmount = subtotal * ((parseFloat(discountPercent) || 0) / 100);
  const afterDiscount  = subtotal - discountAmount;
  const taxAmount      = afterDiscount * ((parseFloat(taxPercent) || 0) / 100);
  const grandTotal     = afterDiscount + taxAmount;
  return {
    subtotal:        +subtotal.toFixed(2),
    discountAmount:  +discountAmount.toFixed(2),
    taxAmount:       +taxAmount.toFixed(2),
    grandTotal:      +grandTotal.toFixed(2),
  };
};

export const STATUS_CONFIG = {
  paid:      { label: 'Paid',      color: 'success' },
  unpaid:    { label: 'Unpaid',    color: 'warning' },
  partial:   { label: 'Partial',   color: 'info'    },
  cancelled: { label: 'Cancelled', color: 'error'   },
};

export const CATEGORIES = [
  'Props', 'Menu Board', 'Display', 'Dessert',
  'Lighting', 'Floral', 'Stage Setup', 'Sound & DJ', 'Photography', 'Other',
];

export const EVENT_TYPES = [
  'Wedding', 'Reception', 'Engagement', 'Birthday', 'Anniversary', 'Corporate', 'Other',
];
