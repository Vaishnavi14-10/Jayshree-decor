import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People';
import { BRAND } from '../../theme';

const WIDTH = 240;

const NAV = [
  { label: 'Dashboard', to: '/', icon: <DashboardIcon />, end: true },
  { label: 'All Invoices', to: '/invoices', icon: <ReceiptLongIcon /> },
  { label: 'New Invoice', to: '/invoices/new', icon: <AddCircleIcon /> },
  { label: 'Clients', to: '/clients', icon: <PeopleIcon /> },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const drawerContent = (
    <Box>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography sx={{ color: '#fff', fontWeight: 700 }}>
          Jayshree Decor
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>Invoice System</Typography>
      </Box>

      {/* Nav */}
      <List sx={{ px: 1.5, py: 2 }}>
        {NAV.map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.to}
              onClick={onClose} // close on mobile click
              sx={{
                borderRadius: 2,
                color: 'rgba(255,255,255,0.6)',
                '&.active': {
                  background: 'rgba(247,201,72,0.15)',
                  color: BRAND.gold,
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: WIDTH,
            background: BRAND.navy,
            color: '#fff',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          width: WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: WIDTH,
            background: BRAND.navy,
            color: '#fff',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}