import { LayoutDashboard, Wallet, ReceiptText, Award, Headphones, Settings, LogOut, HeartPulse, ShieldCheck, Smartphone, Plane, Utensils, ShoppingBag } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { useGlobalState } from '@/src/hooks/useGlobalState';
import { auth } from '../../lib/firebase';

export function Sidebar() {
  const navigate = useNavigate();
  const { balance, profile, bankAccounts } = useGlobalState();
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Payments & Wallet', icon: Wallet, to: '/wallet' },
    { label: 'Shopping', icon: ShoppingBag, to: '/shopping' },
    { label: 'Food Delivery', icon: Utensils, to: '/food' },
    { label: 'Travel Tickets', icon: Plane, to: '/travel' },
    { label: 'Bills & Utilities', icon: Smartphone, to: '/bills' },
    { label: 'Health Care', icon: HeartPulse, to: '/health' },
    { label: 'Insurance Protect', icon: ShieldCheck, to: '/insurance' },
    { label: 'My Orders', icon: ReceiptText, to: '/orders' },
    { label: 'Rewards Hub', icon: Award, to: '/rewards' },
    { label: 'Support Desk', icon: Headphones, to: '/support' },
  ];

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] w-64 bg-white border-r border-gray-100 hidden md:flex flex-col p-6 gap-6">
      <div className="space-y-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm">
            <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="truncate">
            <h2 className="text-sm font-bold text-gray-900 truncate">{profile.name}</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">Premium Member</p>
          </div>
        </div>
        
        {bankAccounts.length > 0 && (
          <>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col gap-1 shadow-sm">
                <span className="text-[9px] text-purple-600 uppercase font-bold tracking-widest">Account Balance</span>
                <span className="text-lg font-bold text-[#7C3AED] truncate">₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <button 
              onClick={() => navigate('/wallet')}
              className="w-full bg-[#7C3AED] text-white text-[11px] font-bold rounded-xl py-3 hover:bg-[#6D28D9] transition-all shadow-lg shadow-purple-200"
            >
              Add Money
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-100 scrollbar-track-transparent">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                isActive 
                  ? "bg-purple-50 text-[#7C3AED] font-bold" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={cn("transition-transform group-hover:scale-110", isActive ? "text-[#7C3AED]" : "text-gray-400")} />
                <span className="text-xs font-bold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-1.5 pt-4 border-t border-gray-100 shrink-0">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
              isActive ? "text-[#7C3AED] font-bold bg-purple-50" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
            )
          }
        >
          <Settings size={18} />
          <span className="text-xs font-bold">Settings</span>
        </NavLink>
        <button 
          onClick={async () => {
            await auth.signOut();
            localStorage.clear();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
        >
          <LogOut size={18} />
          <span className="text-xs font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
