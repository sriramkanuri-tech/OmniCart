import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Download, Eye, X, ShoppingCart, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal tracking states
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/users', {
        headers: {
          'x-admin-email': 'sriramkanuri4@gmail.com'
        }
      });

      // Calculate total orders and total spent for each user locally
      // by retrieving all orders across all users and grouping
      const ordersRes = await axios.get('/api/admin/orders', {
        headers: {
          'x-admin-email': 'sriramkanuri4@gmail.com'
        }
      });
      const allOrders = ordersRes.data || [];
      const parsedUsers = (response.data || []).map(u => {
        const matchingOrders = allOrders.filter(o => o.userEmail === u.email);
        const totalSpent = matchingOrders.filter(o => o.status === 'PAID').reduce((sum, o) => sum + o.amount, 0);
        return {
          ...u,
          totalOrders: matchingOrders.length,
          totalSpent
        };
      });
      setUsers(parsedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to retrieve registered users database.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleViewOrders = async (email, name) => {
    setSelectedUserEmail(email);
    setSelectedUserName(name);
    setOrdersLoading(true);
    try {
      const response = await axios.get(`/api/admin/users/${email}/orders`, {
        headers: {
          'x-admin-email': 'sriramkanuri4@gmail.com'
        }
      });
      setUserOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      toast.error('Could not load user order history.');
    } finally {
      setOrdersLoading(false);
    }
  };
  const exportToCSV = () => {
    if (users.length === 0) {
      toast.error('No users available to export.');
      return;
    }
    const headers = ['Name', 'Email', 'Login Count', 'Last Login', 'Created At', 'Total Orders', 'Total Spent (₹)'];
    const rows = filteredUsers.map(u => [u.name, u.email, u.loginCount, u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'N/A', u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A', u.totalOrders || 0, u.totalSpent || 0]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OmniCart_Registered_Users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('User census report downloaded successfully.');
  };
  const filteredUsers = users.filter(u => u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || u.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="space-y-8 text-slate-800 font-sans">
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Users & Relations</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Audit customer log streams, spend velocity, and purchase logs.</p>
        </div>
        <button onClick={exportToCSV} className="flex items-center gap-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-purple-600/10 cursor-pointer transition-all">
          <Download className="w-4 h-4" />
          <span>Export Client CSV</span>
        </button>
      </div>

      {/* Filter Input */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7C3AED] transition-colors w-4 h-4" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 outline-none text-sm font-medium focus:border-purple-300 shadow-sm transition-all text-slate-800" placeholder="Filter accounts by name or email..." />
      </div>

      {/* Main Database Table Container */}
      {loading ? <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white border border-slate-100 rounded-2xl animate-pulse" />)}
        </div> : filteredUsers.length === 0 ? <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 text-lg">No Users Logged</h3>
          <p className="text-slate-400 text-sm mt-1">There are no client records matching your query criteria.</p>
        </div> : <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold tracking-wider">
                  <th className="py-5 px-6">Avatar</th>
                  <th className="py-5 px-6">Full Name</th>
                  <th className="py-5 px-6">Gmail/Ident</th>
                  <th className="py-5 px-6 text-center">Login Loop</th>
                  <th className="py-5 px-6">Last Login</th>
                  <th className="py-5 px-6 text-center">Orders</th>
                  <th className="py-5 px-6">Spends</th>
                  <th className="py-5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((user, idx) => <tr key={user.email} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200/50 object-cover" />
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">{user.name}</td>
                    <td className="py-4 px-6 font-medium text-slate-500">{user.email}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700">
                      <span className="bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-lg text-xs">
                        {user.loginCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-semibold">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-center font-mono">
                      {user.totalOrders || 0}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-600">
                      ₹{user.totalSpent?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => handleViewOrders(user.email, user.name)} className="bg-white border border-slate-200 hover:border-purple-300 text-slate-600 hover:text-[#7C3AED] font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 mx-auto">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Orders</span>
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}

      {/* Orders Overlay Modal */}
      {selectedUserEmail && <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 flex flex-col justify-between max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Purchase Ledger</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Showing orders placed by: <strong>{selectedUserName}</strong> ({selectedUserEmail})</p>
              </div>
              <button onClick={() => {
            setSelectedUserEmail(null);
            setUserOrders([]);
          }} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto min-h-[300px]">
              {ordersLoading ? <div className="flex items-center justify-center min-h-[250px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C3AED]"></div>
                </div> : userOrders.length === 0 ? <div className="flex flex-col items-center justify-center min-h-[250px] text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <ShoppingCart className="w-10 h-10 text-slate-300 mb-3" />
                  <h4 className="font-bold text-slate-700">No Orders Saved</h4>
                  <p className="text-slate-400 text-xs mt-1">This specific client account has not created any orders inside OmniCart.</p>
                </div> : <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                        <th className="py-4 px-5">Order ID</th>
                        <th className="py-4 px-5">Product Name</th>
                        <th className="py-4 px-5">Sector</th>
                        <th className="py-4 px-5">Amount</th>
                        <th className="py-4 px-5 text-center">Status</th>
                        <th className="py-4 px-5">Payer Tx ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                      {userOrders.map(ord => <tr key={ord.orderId} className="hover:bg-slate-50/40">
                          <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{ord.orderId.substring(0, 13)}...</td>
                          <td className="py-3.5 px-5 font-bold text-slate-700">{ord.productName}</td>
                          <td className="py-3.5 px-5">
                            <span className="bg-purple-50 text-purple-700 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">
                              {ord.category || 'Shopping'}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-bold text-slate-900">₹{ord.amount}</td>
                          <td className="py-3.5 px-5 text-center">
                            <span className={`
                              font-bold px-2.5 py-1 rounded-full text-[9px] 
                              ${ord.status === 'PAID' ? 'bg-green-100 text-green-700' : ord.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}
                            `}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-mono font-semibold text-slate-400">
                            {ord.uropayTransactionId || 'Pending Webhook'}
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end rounded-b-3xl">
              <button onClick={() => {
            setSelectedUserEmail(null);
            setUserOrders([]);
          }} className="bg-white border border-slate-200 hover:bg-slate-100 font-bold text-xs px-5 py-2.5 rounded-xl cursor-not-allowed cursor-pointer transition-colors">
                Close Ledger
              </button>
            </div>
          </div>
        </div>}
    </div>;
}