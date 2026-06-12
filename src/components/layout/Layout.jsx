import { memo } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import AdminFloatingButton from "../AdminFloatingButton";
export const Layout = memo(() => {
  return <div className="min-h-screen bg-[#F8F9FA] selection:bg-purple-100 selection:text-purple-600">
      <Navbar />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-8 md:p-12 min-h-[calc(100vh-80px)] pb-32 md:pb-16">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
      <AdminFloatingButton />
      
      <footer className="w-full py-12 px-12 flex flex-col md:flex-row justify-between items-center md:ml-64 md:w-[calc(100%-16rem)] border-t border-gray-100 bg-white gap-8">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <p className="text-sm font-bold text-gray-900">OmniCart Architecture</p>
          <div className="flex gap-4 items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
             <span className="text-[#7C3AED]">Ready to Serve</span>
             <span>•</span>
             <span>Ver 2.5.0</span>
          </div>
        </div>
        <div className="flex gap-8 flex-wrap justify-center font-sans">
          {["Client Policy", "Privacy", "Concierge Terms", "Studio Details"].map((link) => <a
    key={link}
    href="#"
    className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#7C3AED] transition-colors font-bold"
  >
              {link}
            </a>)}
        </div>
      </footer>
    </div>;
});
Layout.displayName = "Layout";
