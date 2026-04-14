import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard';
import NewInvoice from './pages/NewInvoice';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Jayshree Decor</h2>
        <p>Invoice Management</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/invoices" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">📄</span> All Invoices
        </NavLink>
        <NavLink to="/invoices/new" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">➕</span> New Invoice
        </NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/new" element={<NewInvoice />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
