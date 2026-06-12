import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGlobalState } from '../hooks/useGlobalState';
export default function AdminRoute() {
  const {
    profile,
    isLoading
  } = useGlobalState();
  if (isLoading) {
    return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7C3AED]"></div>
      </div>;
  }

  // Strictly check if email matches admin email
  const isAdmin = profile?.email === 'sriramkanuri4@gmail.com';
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}