import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { GlobalStateProvider } from './hooks/useGlobalState';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Food from './pages/Food';
import Wallet from './pages/Wallet';
import Travel from './pages/Travel';
import Shopping from './pages/Shopping';
import Health from './pages/Health';
import Insurance from './pages/Insurance';
import Bills from './pages/Bills';
import Settings from './pages/Settings';
import Orders from './pages/Orders';
import Rewards from './pages/Rewards';
import Support from './pages/Support';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOffers from './pages/admin/AdminOffers';
import AdminOrders from './pages/admin/AdminOrders';
import './index.css';

// Stub pages
const Stub = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
    <div className="w-24 h-[1px] bg-primary/30" />
    <div className="space-y-4">
      <h1 className="text-5xl font-light font-display italic text-white">{title}</h1>
      <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Protocol Implementation in Progress</p>
    </div>
    <div className="w-24 h-[1px] bg-primary/30" />
  </div>
);

function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/food" element={<Food />} />
            <Route path="/travel" element={<Travel />} />
            
            <Route path="/orders" element={<Orders />} />
            <Route path="/my-orders" element={<Orders />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Settings />} />
            <Route path="/search" element={<Stub title="Search" />} />
            <Route path="/services" element={<Stub title="All Services" />} />
            <Route path="/history" element={<Stub title="Transaction History" />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="/payments" element={<Wallet />} />
            <Route path="/health" element={<Health />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
          </Route>
          
          {/* Admin Protected Workspace */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/offers" element={<AdminOffers />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
