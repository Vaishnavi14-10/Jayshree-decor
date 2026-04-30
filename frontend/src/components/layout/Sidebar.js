import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider,
} from '@mui/material';
import DashboardIcon    from '@mui/icons-material/Dashboard';
import ReceiptLongIcon  from '@mui/icons-material/ReceiptLong';
import AddCircleIcon    from '@mui/icons-material/AddCircle';
import PeopleIcon       from '@mui/icons-material/People';
import { BRAND } from '../../theme';

const WIDTH = 240;

const NAV = [
  { label: 'Dashboard',    to: '/',          icon: <DashboardIcon />,   end: true },
  { label: 'All Invoices', to: '/invoices',  icon: <ReceiptLongIcon /> },
  { label: 'New Invoice',  to: '/invoices/new', icon: <AddCircleIcon /> },
  { label: 'Clients',      to: '/clients',   icon: <PeopleIcon /> },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: WIDTH,
          background: BRAND.navy,
          border: 'none',
          color: '#fff',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, background: BRAND.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: BRAND.navy, lineHeight: 1 }}>JD</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#fff', lineHeight: 1.2 }}>Jayshree Decor</Typography>
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>Invoice System</Typography>
          </Box>
        </Box>
      </Box>

      {/* Nav */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {NAV.map((item) => (
          <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.to}
              end={item.end}
              sx={{
                borderRadius: 2,
                px: 1.5,
                py: 1,
                color: 'rgba(255,255,255,0.6)',
                '&.active': {
                  background: 'rgba(247,201,72,0.15)',
                  color: BRAND.gold,
                  '& .MuiListItemIcon-root': { color: BRAND.gold },
                },
                '&:hover': {
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ px: 2.5, py: 1.5 }}>
        <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>v3.0.0 · Production</Typography>
      </Box>
    </Drawer>
  );
}

export { WIDTH as SIDEBAR_WIDTH };
