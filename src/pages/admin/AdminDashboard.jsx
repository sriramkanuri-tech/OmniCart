import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  TrendingUp,
  RefreshCw,
  Award,
  ShieldAlert
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";
const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/admin/stats", {
        headers: {
          "x-admin-email": "sriramkanuri4@gmail.com"
        }
      });
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
      setError(err?.response?.data?.error || "Failed to authenticate and load analytics.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);
  if (loading) {
    return <div className="space-y-8 animate-pulse text-slate-800">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-slate-200 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[400px] bg-slate-200 rounded-3xl" />
          <div className="h-[400px] bg-slate-200 rounded-3xl" />
        </div>
      </div>;
  }
  if (error) {
    return <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4 text-red-800">
        <ShieldAlert className="w-10 h-10 text-red-500" />
        <div>
          <h2 className="font-bold text-lg">Failed to Load Dashboard Data</h2>
          <p className="text-sm">{error}</p>
          <button onClick={fetchStats} className="mt-2 text-xs font-bold underline cursor-pointer">
            Retry Loading
          </button>
        </div>
      </div>;
  }
  return <div className="space-y-10 text-slate-800 font-sans">
      {
    /* Title & Controls */
  }
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Real-time aggregate platform metrics for OmniCart.</p>
        </div>
        <button
    onClick={fetchStats}
    className="flex items-center gap-2 bg-white border border-slate-200 hover:border-purple-300 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm hover:text-purple-600 transition-colors cursor-pointer"
  >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh stats</span>
        </button>
      </div>

      {
    /* Stats Cards Row */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {
    /* Card 1: Total Users */
  }
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Total Users</span>
              <p className="text-3xl font-black text-slate-900">{stats?.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] text-green-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active users tracked</span>
          </div>
        </div>

        {
    /* Card 2: Total Orders */
  }
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Total Orders</span>
              <p className="text-3xl font-black text-slate-900">{stats?.totalOrders}</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] text-green-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>All gateway checkouts</span>
          </div>
        </div>

        {
    /* Card 3: Total Revenue */
  }
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Total Revenue</span>
              <p className="text-3xl font-black text-slate-900">₹{stats?.totalRevenue.toLocaleString("en-IN")}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] text-purple-600 font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Successfully Paid status</span>
          </div>
        </div>

        {
    /* Card 4: Today Orders */
  }
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Today's Orders</span>
              <p className="text-3xl font-black text-slate-900">{stats?.todayOrders}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] text-green-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Placed today</span>
          </div>
        </div>

        {
    /* Card 5: Today Revenue */
  }
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Today's Revenue</span>
              <p className="text-2xl font-black text-slate-900 truncate">₹{stats?.todayRevenue.toLocaleString("en-IN")}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] text-emerald-500 font-bold animate-pulse">
            <span>Live Webhook feeds</span>
          </div>
        </div>
      </div>

      {
    /* Charts Grid */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {
    /* Left Column: Bar Chart */
  }
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Orders Revenue by Category</h2>
              <p className="text-xs text-slate-500 mt-0.5">Aggregate spending splits across OmniCart product segments.</p>
            </div>
            <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2.5 py-1 rounded-full">
              LIVE CHART
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
    data={stats?.categoryBreakdown}
    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
  >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip
    formatter={(value) => [`\u20B9${parseFloat(value).toLocaleString("en-IN")}`, "Revenue"]}
    contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", border: "none", color: "#FFF" }}
  />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                <Bar dataKey="value" name="Revenue Amount (₹)" radius={[8, 8, 0, 0]}>
                  {stats?.categoryBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {
    /* Right Column: Platform Diagnostics / Summary */
  }
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Gateways Settings</h2>
            <p className="text-xs text-slate-500 mb-6">Details of current UroPay configuration endpoints.</p>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider mb-1">Gateway API Partner</span>
                <span className="text-sm font-bold text-slate-800">UroPay (uropay.me)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider mb-1">Settlement UPI Address</span>
                <span className="text-sm font-bold text-[#7C3AED] font-mono">9948746315@fam</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider mb-1">Security Webhook Trigger</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                  <span className="text-xs font-bold text-slate-600 truncate">/api/webhook/uropay</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-400">Environment:</span>
            <span className="bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
              Live Production
            </span>
          </div>
        </div>
      </div>
    </div>;
}
