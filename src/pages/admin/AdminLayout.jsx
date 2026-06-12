import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useGlobalState } from "../../hooks/useGlobalState";
import {
  BarChart,
  Users,
  ShoppingBag,
  Tag,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { Toaster } from "react-hot-toast";
export default function AdminLayout() {
  const { profile } = useGlobalState();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isAdmin = profile?.email === "sriramkanuri4@gmail.com";
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: BarChart },
    { name: "Users & Orders", path: "/admin/users", icon: Users },
    { name: "Products", path: "/admin/products", icon: ShoppingBag },
    { name: "Offers", path: "/admin/offers", icon: Tag },
    { name: "Orders Log", path: "/admin/orders", icon: ShoppingCart }
  ];
  if (!isAdmin) {
    return <div className="min-h-screen bg-slate-930 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-6">You must be logged in as the primary administrator to view this panel.</p>
        <button
      onClick={() => navigate("/")}
      className="bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-indigo font-bold text-sm"
    >
          Return to OmniCart
        </button>
      </div>;
  }
  return <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800 font-sans">
      <Toaster position="top-right" />

      {
    /* Desktop Sidebar */
  }
      <aside className="hidden md:flex flex-col w-64 bg-[#0F172A] text-slate-200 shrink-0 border-r border-[#1E293B]">
        {
    /* Banner/Title */
  }
        <div className="p-6 border-b border-[#1E293B] flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 flex items-center justify-center rounded-xl shadow-lg shadow-purple-900/30">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight">OmniCart</h1>
            <p className="text-[10px] text-purple-400 uppercase tracking-widest font-semibold">Admin Panel</p>
          </div>
        </div>

        {
    /* User Info Card */
  }
        <div className="p-4 mx-4 my-6 bg-[#1E293B]/50 rounded-xl flex items-center gap-3 border border-[#334155]/20">
          <img
    src={profile?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"}
    className="w-10 h-10 rounded-full border border-purple-500 object-cover"
    alt="Admin Avatar"
  />
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-white truncate">{profile?.name || "Administrator"}</p>
            <p className="text-[10px] text-slate-400 truncate font-semibold">{profile?.email}</p>
          </div>
        </div>

        {
    /* Links Navigation */
  }
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
    const Icon = item.icon;
    return <NavLink
      key={item.path}
      to={item.path}
      end={item.path === "/admin"}
      className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-tight transition-all
                  ${isActive ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-slate-400 hover:text-white hover:bg-[#1E293B]"}
                `}
    >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>;
  })}
        </nav>

        {
    /* Action Footers */
  }
        <div className="p-4 border-t border-[#1E293B]">
          <button
    onClick={() => navigate("/dashboard")}
    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50 transition-colors cursor-pointer"
  >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit to Store</span>
          </button>
        </div>
      </aside>

      {
    /* Mobile Top Header */
  }
      <header className="md:hidden bg-[#0F172A] text-slate-200 px-6 py-4 flex items-center justify-between border-b border-[#1E293B] sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 flex items-center justify-center rounded-lg">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight">OmniCart</h1>
            <p className="text-[8px] text-purple-400 uppercase tracking-widest font-semibold">Admin</p>
          </div>
        </div>
        <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="text-slate-200 hover:text-white"
  >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {
    /* Mobile Dropdown Menu Container */
  }
      {mobileMenuOpen && <div className="md:hidden bg-[#0F172A] text-slate-200 px-6 py-4 space-y-2 border-b border-[#1E293B] fixed w-full top-16 left-0 z-40 shadow-2xl">
          {menuItems.map((item) => {
    const Icon = item.icon;
    return <NavLink
      key={item.path}
      to={item.path}
      end={item.path === "/admin"}
      onClick={() => setMobileMenuOpen(false)}
      className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm
                  ${isActive ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white hover:bg-[#1E293B]"}
                `}
    >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>;
  })}
          <button
    onClick={() => {
      setMobileMenuOpen(false);
      navigate("/dashboard");
    }}
    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50 mt-4"
  >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit to Store</span>
          </button>
        </div>}

      {
    /* Main Pages Content Window */
  }
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden md:overflow-y-auto">
        <Outlet />
      </main>
    </div>;
}
