import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SpaProvider, useSpa } from './context/SpaContext';
import { CustomerLayout, AdminLayout } from './components/Layouts';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import BookingPage from './pages/customer/BookingPage';
import BookingSuccessPage from './pages/customer/BookingSuccessPage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import BookingsPage from './pages/admin/BookingsPage';
import CustomersPage from './pages/admin/CustomersPage';
import ServicesPage from './pages/admin/ServicesPage';

// Protected Route Component
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin } = useSpa();
  if (!admin.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
      <Route path="/booking" element={<CustomerLayout><BookingPage /></CustomerLayout>} />
      <Route path="/success" element={<CustomerLayout><BookingSuccessPage /></CustomerLayout>} />

      {/* Admin Login (No Layout) */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedAdminRoute><DashboardPage /></ProtectedAdminRoute>} />
      <Route path="/admin/bookings" element={<ProtectedAdminRoute><BookingsPage /></ProtectedAdminRoute>} />
      <Route path="/admin/customers" element={<ProtectedAdminRoute><CustomersPage /></ProtectedAdminRoute>} />
      <Route path="/admin/services" element={<ProtectedAdminRoute><ServicesPage /></ProtectedAdminRoute>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <SpaProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </SpaProvider>
  );
};

export default App;
