import React from 'react';
import { Chip } from '@mui/material';
import { STATUS_CONFIG } from '../../utils/helpers';

export default function StatusChip({ status, size = 'small' }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'default' };
  return <Chip label={cfg.label} color={cfg.color} size={size} />;
}
