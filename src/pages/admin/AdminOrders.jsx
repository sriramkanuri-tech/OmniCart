import { useEffect, useState } from "react";
import axios from "axios";
import {
  Filter,
  RefreshCw,
  ShoppingBag,
  ArrowUpRight
} from "lucide-react";
import toast from "react-hot-toast";
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/orders", {
        headers: { "x-admin-email": "sriramkanuri4@gmail.com" }
      });
      setOrders(response.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to retrieve system order logs.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const handleUpdateStatus = async (orderId, currentStatus) => {
    const nextStatus = currentStatus === "PENDING" ? "PAID" : "FAILED";
    try {
      await axios.post(`/api/webhook/uropay`, {
        orderId,
        status: nextStatus,
        transactionId: "TEST-TX-" + Math.random().toString(36).substring(4).toUpperCase(),
        payerEmail: "sriramkanuri4@gmail.com",
        amount: 50
      });
      toast.success(`Order ${orderId} status set to ${nextStatus}.`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to alter status over webhook simulation.");
    }
  };
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    let orderCategory = "Shopping";
    let type = o.type || "";
    if (type === "food" || type === "Food") orderCategory = "Food";
    else if (type === "flight" || type === "travel" || type === "Travel") orderCategory = "Travel";
    else if (type === "bills" || type === "Bills") orderCategory = "Bills";
    const matchesCategory = categoryFilter === "All" || orderCategory === categoryFilter;
    let matchesDate = true;
    if (startDate || endDate) {
      const orderDateStr = o.timestamp || (/* @__PURE__ */ new Date()).toISOString();
      const orderTime = new Date(orderDateStr).getTime();
      if (startDate) {
        const start = new Date(startDate).getTime();
        if (orderTime < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate).getTime() + 864e5;
        if (orderTime > end) matchesDate = false;
      }
    }
    const matchesKeyword = searchQuery === "" || o.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) || o.productName?.toLowerCase().includes(searchQuery.toLowerCase()) || o.userName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesDate && matchesKeyword;
  });
  return <div className="space-y-8 text-slate-800 font-sans">
      {
    /* Title block */
  }
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Orders Ledger</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Review ledger transactions, buyer emails, gateway statuses, and date criteria.</p>
        </div>
        <button
    onClick={fetchOrders}
    className="flex items-center gap-2 bg-white border border-slate-200 hover:border-purple-300 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm hover:text-[#7C3AED] transition-all cursor-pointer"
  >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh ledger</span>
        </button>
      </div>

      {
    /* Structured Filter Utilities Layout */
  }
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          <Filter className="w-4.5 h-4.5 text-[#7C3AED]" />
          <span>Refine Transactions Search</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 font-bold text-xs text-slate-400">
          {
    /* Status filter dropdown */
  }
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Status</label>
            <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none text-slate-700 focus:border-purple-200"
  >
              <option value="All">All statuses</option>
              <option value="PAID">PAID</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          {
    /* Category filter dropdown */
  }
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Category</label>
            <select
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none text-slate-700 focus:border-purple-200"
  >
              <option value="All">All Categories</option>
              <option value="Shopping">Shopping</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
            </select>
          </div>

          {
    /* Start Date selection */
  }
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Start Date</label>
            <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none text-slate-700 focus:border-purple-200 cursor-pointer"
  />
          </div>

          {
    /* End Date selection */
  }
          <div className="space-y-1">
            <label className="uppercase tracking-wider">End Date</label>
            <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none text-slate-700 focus:border-purple-200 cursor-pointer"
  />
          </div>

          {
    /* Keyword Query Search bar */
  }
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Search</label>
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="e.g. Gmail / Product"
    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none text-slate-700 focus:border-purple-200"
  />
          </div>
        </div>
      </div>

      {
    /* Orders Table Log */
  }
      {loading ? <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white border border-slate-100 rounded-2xl animate-pulse" />)}
        </div> : filteredOrders.length === 0 ? <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 text-lg">No Orders Registered</h3>
          <p className="text-slate-400 text-sm mt-1">There are no client invoices corresponding to the current filtered view.</p>
        </div> : <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold tracking-wider">
                  <th className="py-5 px-6">Order ID</th>
                  <th className="py-5 px-6">Customer Gmail</th>
                  <th className="py-5 px-6">Product / Merchant</th>
                  <th className="py-5 px-6">Sector</th>
                  <th className="py-5 px-6">Amount</th>
                  <th className="py-5 px-6 text-center">Status</th>
                  <th className="py-5 px-6 font-mono">UroPay ID</th>
                  <th className="py-5 px-6">Date</th>
                  <th className="py-5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map((ord) => {
    let mappedCat = "Shopping";
    let type = ord.type || "";
    if (type === "food" || type === "Food") mappedCat = "Food";
    else if (type === "flight" || type === "travel" || type === "Travel") mappedCat = "Travel";
    else if (type === "bills" || type === "Bills") mappedCat = "Bills";
    return <tr key={ord.orderId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4.5 px-6 font-mono font-bold text-slate-900 text-xs">
                        {ord.orderId.substring(0, 15)}...
                      </td>
                      <td className="py-4.5 px-6">
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{ord.userName || "N/A"}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{ord.userEmail || "N/A"}</p>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 font-bold text-slate-700">{ord.productName}</td>
                      <td className="py-4.5 px-6">
                        <span className="bg-purple-100 text-purple-700 font-extrabold px-2.5 py-1 rounded-lg text-[9px] uppercase">
                          {mappedCat}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 font-extrabold text-slate-900">
                        ₹{ord.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4.5 px-6 text-center">
                        <span className={`
                          font-bold px-2.5 py-1 rounded-full text-[10px] uppercase
                          ${ord.status === "PAID" ? "bg-green-100 text-green-700" : ord.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}
                        `}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 font-mono text-xs text-slate-400 font-bold">
                        {ord.uropayTransactionId || "Awaiting Webhook"}
                      </td>
                      <td className="py-4.5 px-6 text-xs text-slate-400 font-semibold">
                        {ord.timestamp ? new Date(ord.timestamp).toLocaleString("en-IN") : "Just now"}
                      </td>
                      <td className="py-4.5 px-6 text-center">
                        <button
      onClick={() => handleUpdateStatus(ord.orderId, ord.status)}
      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1 mx-auto"
    >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Simulate Webhook</span>
                        </button>
                      </td>
                    </tr>;
  })}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
}
