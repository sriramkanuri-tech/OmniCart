import { ShoppingBag, Bell, Search, MapPin, ChevronDown } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useGlobalState } from '@/src/hooks/useGlobalState';

export function Navbar() {
  const navigate = useNavigate();
  const { profile } = useGlobalState();
  const horizontalNav = [
    { label: 'Shopping', to: '/shopping' },
    { label: 'Travel', to: '/travel' },
    { label: 'Food Delivery', to: '/food' },
    { label: 'Payments', to: '/payments' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-12 h-20 bg-white border-b border-gray-100">
      <div className="flex items-center gap-12">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7C3AED] flex items-center justify-center rounded-2xl shadow-lg shadow-purple-200">
            <ShoppingBag className="text-white" size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">OmniCart</span>
            <span className="text-[10px] text-gray-400 font-bold">One App. All Your Needs.</span>
          </div>
        </NavLink>

        <nav className="hidden lg:flex gap-8 ml-4">
          {horizontalNav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-[12px] font-bold transition-all flex items-center gap-2",
                  isActive ? "text-[#7C3AED]" : "text-gray-400 hover:text-gray-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="w-1 h-1 rounded-full bg-[#7C3AED]" />}
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
          <Search size={20} />
        </button>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</span>
        </button>
        
        <div 
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 cursor-pointer ml-2 hover:ring-2 hover:ring-[#7C3AED]/30 transition-all"
          title="Open Settings"
        >
          <img 
            src={profile.avatar} 
            alt="Profile" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
