import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme            from './theme';
import MainLayout       from './components/layout/MainLayout';
import Dashboard        from './pages/Dashboard';
import InvoiceList      from './pages/InvoiceList';
import NewInvoice       from './pages/NewInvoice';
import EditInvoice      from './pages/EditInvoice';
import InvoiceDetail    from './pages/InvoiceDetail';
import Clients          from './pages/Clients';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/"                    element={<Dashboard />}     />
            <Route path="/invoices"            element={<InvoiceList />}   />
            <Route path="/invoices/new"        element={<NewInvoice />}    />
            <Route path="/invoices/:id"        element={<InvoiceDetail />} />
            <Route path="/invoices/:id/edit"   element={<EditInvoice />}   />
            <Route path="/clients"             element={<Clients />}       />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
