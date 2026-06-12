import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingBag,
  Clock,
  ShieldCheck,
  Plane,
  Utensils,
  HeartPulse,
  ShoppingCart,
  Search,
  X,
  CheckCircle2
} from "lucide-react";
import { useGlobalState } from "@/src/hooks/useGlobalState";
import { cn } from "@/src/lib/utils";
export default function Orders() {
  const navigate = useNavigate();
  const { profile } = useGlobalState();
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      const email = profile?.email || "guest@omnicart.com";
      try {
        const res = await axios.get(`/api/orders/my-orders?email=${encodeURIComponent(email)}`);
        const mappedOrders = res.data.map((o) => ({
          id: o.orderId,
          type: o.category ? o.category.toLowerCase() : "shopping",
          title: o.productName,
          subtitle: `Ref: ${o.uropayTransactionId || "Payment received"}`,
          amount: o.amount,
          date: new Date(o.placedAt || /* @__PURE__ */ new Date()).toLocaleDateString(),
          status: o.status
        }));
        mappedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrdersList(mappedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [profile]);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "success":
      case "active":
      case "placed":
      case "paid":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "preparing":
      case "in transit":
      case "pending":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "scheduled":
      case "confirmed":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-150";
    }
  };
  const getOrderIcon = (type) => {
    switch (type) {
      case "food":
      case "pizza":
      case "burgers":
        return <Utensils size={18} className="text-orange-500" />;
      case "shopping":
      case "watches":
      case "audio":
        return <ShoppingCart size={18} className="text-blue-500" />;
      case "flight":
      case "package":
      case "travel":
        return <Plane size={18} className="text-purple-500" />;
      case "health":
        return <HeartPulse size={18} className="text-rose-500" />;
      case "insurance":
        return <ShieldCheck size={18} className="text-[#7C3AED]" />;
      default:
        return <ShoppingBag size={18} className="text-gray-500" />;
    }
  };
  const filteredOrders = ordersList.filter((ord) => {
    const matchesFilter = filterType === "all" || ord.type.includes(filterType) || filterType === "travel" && (ord.type === "flight" || ord.type === "package");
    const matchesSearch = ord.title.toLowerCase().includes(searchQuery.toLowerCase()) || ord.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  return <div className="space-y-12 pb-12 font-sans relative">
      {
    /* Header */
  }
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Your Orders</h1>
          <p className="text-gray-500 font-medium text-lg">Detailed ledger of your lifestyle, protection, and retail orders with real-time delivery tracking.</p>
        </div>
      </div>

      {
    /* Filter and search options (Bento Layout) */
  }
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="relative group flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" size={18} />
          <input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search orders, brands or descriptions..."
    className="w-full bg-gray-50 border border-gray-50 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-purple-50 focus:bg-white focus:border-purple-200 transition-all placeholder:text-gray-400"
  />
        </div>

        <div className="flex gap-2 p-1 bg-gray-50 border border-gray-100 rounded-2xl overflow-x-auto no-scrollbar w-full md:w-auto shrink-0">
          {[
    { id: "all", label: "All Orders" },
    { id: "food", label: "Food" },
    { id: "shopping", label: "Shopping" },
    { id: "travel", label: "Travel" },
    { id: "health", label: "Health" },
    { id: "insurance", label: "Insurance" }
  ].map((tab) => <button
    key={tab.id}
    onClick={() => setFilterType(tab.id)}
    className={cn(
      "px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
      filterType === tab.id ? "bg-[#7C3AED] text-white shadow-md" : "text-gray-500 hover:bg-white"
    )}
  >
              {tab.label}
            </button>)}
        </div>
      </div>

      {
    /* Orders Grid */
  }
      <section className="space-y-8 animate-fade-in">
        {filteredOrders.length === 0 ? <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-150 shadow-sm max-w-xl mx-auto space-y-4">
             <div className="w-16 h-16 bg-purple-50 text-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-6"><ShoppingBag size={28} /></div>
             <p className="text-xl font-bold text-gray-900">No Orders Lodge Record Found</p>
             <p className="text-sm font-semibold text-gray-400">Order from our Food, Shopping, Travel, Health, or Insurance systems to generate dynamic listings.</p>
             <button
    onClick={() => navigate("/shopping")}
    className="mt-4 px-6 py-3 bg-[#7C3AED] hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-200 transition-all cursor-pointer inline-flex items-center gap-2"
  >
               <ShoppingBag size={16} />
               Go to Shopping
             </button>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredOrders.map((ord) => <motion.div
    key={ord.id}
    whileHover={{ y: -4 }}
    onClick={() => setSelectedOrder(ord)}
    className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between h-full relative overflow-hidden group"
  >
                <div className="flex gap-6">
                  {ord.image ? <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-50 bg-gray-50 shadow-inner">
                      <img src={ord.image} alt={ord.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div> : <div className="w-20 h-20 rounded-2xl shrink-0 bg-gray-55 border border-gray-100 flex items-center justify-center shadow-inner text-[#7C3AED]">
                      {getOrderIcon(ord.type)}
                    </div>}
                  
                  <div className="space-y-1.5 flex-1 select-none">
                     <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-bold text-gray-950 group-hover:text-[#7C3AED] transition-colors leading-snug line-clamp-1">{ord.title}</h3>
                        <span className="text-xs font-black text-gray-900 shrink-0">₹{ord.amount.toLocaleString("en-IN")}</span>
                     </div>
                     <p className="text-xs font-semibold text-gray-550 leading-relaxed line-clamp-1">{ord.subtitle}</p>
                     
                     <div className="flex items-center gap-3 pt-2">
                       <span className={cn("text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider", getStatusStyle(ord.status))}>
                         {ord.status}
                       </span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ord.date}</span>
                     </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-450 uppercase tracking-wider select-none shrink-0">
                  <div className="flex items-center gap-2">
                     <Clock size={14} className="text-[#7C3AED]" />
                     <span>REF ID: {ord.id}</span>
                  </div>
                  <span className="text-[#7C3AED] group-hover:translate-x-1 transition-transform">Track shipment & review ➔</span>
                </div>
              </motion.div>)}
          </div>}
      </section>

      {
    /* TRACKING MODAL */
  }
      <AnimatePresence>
        {selectedOrder && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative p-10 space-y-6"
  >
              <button
    onClick={() => setSelectedOrder(null)}
    className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer"
  >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full">Fulfillment Tracker</span>
                <h3 className="text-xl font-bold text-gray-900 pt-2 leading-tight">{selectedOrder.title}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Ref UUID: {selectedOrder.id}</p>
              </div>

              {
    /* Steps Progress Visualizer */
  }
              <div className="space-y-6 pt-4">
                 {[
    { label: "Order Registered & Settle processed", desc: "Secure wallet authorized settlement", completed: true },
    { label: "Fulfillment dispatched/verified", desc: "Merchant underwrote fulfillment", completed: ["active", "confirmed", "preparing", "in transit", "delivered", "scheduled"].includes(selectedOrder.status.toLowerCase()) },
    { label: "Carrier Transit routing", desc: "Symmetric transport tracking active", completed: ["active", "preparing", "in transit", "delivered", "scheduled"].includes(selectedOrder.status.toLowerCase()) && selectedOrder.status !== "confirmed" },
    { label: "Success Clearance achieved", desc: "Delivered securely to consumer node", completed: ["delivered", "active", "success"].includes(selectedOrder.status.toLowerCase()) }
  ].map((step, sIdx) => <div key={sIdx} className="flex gap-4 relative">
                     {sIdx < 3 && <div className={cn(
    "absolute left-[11px] top-6 w-[2px] h-[calc(100%+12px)] transition-all",
    step.completed ? "bg-emerald-500" : "bg-gray-150"
  )} />}
                     <div className={cn(
    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-white",
    step.completed ? "bg-emerald-500 shadow-md shadow-emerald-100" : "bg-gray-150"
  )}>
                       {step.completed ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                     </div>
                     <div className="select-none">
                       <p className={cn("text-xs font-bold leading-none", step.completed ? "text-gray-900" : "text-gray-400")}>{step.label}</p>
                       <p className="text-[10px] font-semibold text-gray-405 leading-relaxed mt-1">{step.desc}</p>
                     </div>
                   </div>)}
              </div>

              <div className="border-t border-gray-100 pt-5 flex justify-between items-center text-xs font-bold leading-none select-none">
                <div>
                  <p className="text-gray-400 mb-1 font-semibold uppercase tracking-widest">Settle Rate</p>
                  <p className="text-lg font-black text-gray-900">₹{selectedOrder.amount.toLocaleString("en-IN")}</p>
                </div>
                <button
    onClick={() => setSelectedOrder(null)}
    className="px-6 py-3 bg-[#7C3AED] hover:bg-purple-700 text-white text-xs font-bold uppercase rounded-xl shadow-lg transition-all"
  >
                  Dismiss Track
                </button>
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>
    </div>;
}
