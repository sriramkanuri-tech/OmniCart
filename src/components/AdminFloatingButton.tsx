import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../hooks/useGlobalState';
import { Settings } from 'lucide-react';

export default function AdminFloatingButton() {
  const { profile } = useGlobalState();
  const navigate = useNavigate();

  const isAdmin = profile?.email === 'sriramkanuri4@gmail.com';

  if (!isAdmin) return null;

  return (
    <button
      onClick={() => navigate('/admin')}
      className="fixed bottom-6 right-6 z-[99] bg-[#7C3AED] hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer border border-purple-400 group"
      id="admin-floating-btn"
    >
      <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
      <span>Admin Controls</span>
    </button>
  );
}
