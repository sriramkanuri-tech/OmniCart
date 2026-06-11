import { Home, Search, LayoutGrid, History, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export function BottomNav() {
  const navItems = [
    { label: 'Home', icon: Home, to: '/dashboard' },
    { label: 'Search', icon: Search, to: '/search' },
    { label: 'Hub', icon: LayoutGrid, to: '/services', isCenter: true },
    { label: 'History', icon: History, to: '/history' },
    { label: 'Account', icon: User, to: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-20 z-50 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        if (item.isCenter) {
          return (
            <div key={item.label} className="relative -top-6">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-center w-14 h-14 bg-[#7C3AED] text-white rounded-2xl shadow-lg shadow-purple-200 transition-all active:scale-90",
                    isActive && "ring-4 ring-purple-100"
                  )
                }
              >
                <item.icon size={24} />
              </NavLink>
            </div>
          );
        }
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1.5 transition-colors",
                isActive ? "text-[#7C3AED]" : "text-gray-400"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn("text-[10px] font-bold", isActive ? "" : "")}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
