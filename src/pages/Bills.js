import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Zap, Droplets, Tv, Wifi, Phone, CreditCard, Search, Plus, X, CheckCircle2, AlertTriangle, Edit2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useGlobalState } from '@/src/hooks/useGlobalState';
const BILL_CATEGORIES = [{
  id: 'mobile',
  icon: Smartphone,
  label: 'Mobile Recharge',
  color: 'bg-blue-50 text-blue-600',
  placeholder: 'Enter 10-digit mobile number'
}, {
  id: 'electricity',
  icon: Zap,
  label: 'Electricity',
  color: 'bg-orange-50 text-orange-600',
  placeholder: 'Enter 12-digit consumer account ID'
}, {
  id: 'water',
  icon: Droplets,
  label: 'Water Bill',
  color: 'bg-cyan-50 text-cyan-600',
  placeholder: 'Enter consumer billing number'
}, {
  id: 'dth',
  icon: Tv,
  label: 'DTH / Cable',
  color: 'bg-red-50 text-red-600',
  placeholder: 'Enter viewing smart-card identifier'
}, {
  id: 'broadband',
  icon: Wifi,
  label: 'Broadband',
  color: 'bg-purple-50 text-[#7C3AED]',
  placeholder: 'Enter fixed-line broadband number'
}, {
  id: 'landline',
  icon: Phone,
  label: 'Landline',
  color: 'bg-green-50 text-green-600',
  placeholder: 'Enter landline number with STD scale'
}, {
  id: 'card',
  icon: CreditCard,
  label: 'Credit Card',
  color: 'bg-gray-50 text-gray-900',
  placeholder: 'Enter 16-digit visual card value'
}];
export default function BillsPage() {
  const {
    balance,
    updateBalance,
    addTransaction,
    profile
  } = useGlobalState();
  const isAdmin = profile?.email === "sriramkanuri4@gmail.com";
  const [searchQuery, setSearchQuery] = useState('');

  // Settle active bills status locally for seamless interactive feel
  const [bsnlFeePaid, setBsnlFeePaid] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState(null);

  // Custom form inputs
  const [billerInput, setBillerInput] = useState('');
  const [billAmount, setBillAmount] = useState('499');

  // Toast notifications
  const [toast, setToast] = useState({
    show: false,
    msg: '',
    success: true
  });
  const triggerToast = (msg, success = true) => {
    setToast({
      show: true,
      msg,
      success
    });
    setTimeout(() => setToast(prev => ({
      ...prev,
      show: false
    })), 3000);
  };
  const handlePayDueBsnl = () => {
    const dueAmount = 1299;
    if (balance < dueAmount) {
      triggerToast('Insufficient wallet funds to clear this bill!', false);
      return;
    }
    updateBalance(balance - dueAmount);
    addTransaction({
      title: 'BSNL Fiber (Broadband Paid)',
      subtitle: 'Fiber broadband utility • Just now',
      amount: dueAmount,
      type: 'out',
      status: 'Success'
    });
    setBsnlFeePaid(true);
    triggerToast('Thank you! BSNL Fiber Bill of ₹1,299 has been settled successfully.');
  };
  const handleCustomBillSubmit = e => {
    e.preventDefault();
    if (!billerInput.trim()) {
      triggerToast('Please provide a valid account or connection ID', false);
      return;
    }
    const amt = parseFloat(billAmount);
    if (isNaN(amt) || amt <= 0) {
      triggerToast('Please input a valid positive amount', false);
      return;
    }
    if (balance < amt) {
      triggerToast('Insufficient wallet funds to complete this bill payment!', false);
      return;
    }
    updateBalance(balance - amt);
    addTransaction({
      title: `${selectedBiller.label} Payment`,
      subtitle: `${billerInput} • Just now`,
      amount: amt,
      type: 'out',
      status: 'Success'
    });
    triggerToast(`Payment of ₹${amt} for ${selectedBiller.label} has been settled!`);
    setSelectedBiller(null);
    setBillerInput('');
    setBillAmount('499');
  };
  const filteredCategories = BILL_CATEGORIES.filter(cat => cat.label.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="space-y-12 pb-12 font-sans relative">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast.show && <motion.div initial={{
        opacity: 0,
        y: -50
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -50
      }} className={cn("fixed top-24 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl font-bold text-sm text-white", toast.success ? "bg-emerald-600" : "bg-red-600")}>
            {toast.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{toast.msg}</span>
          </motion.div>}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Bills & Recharges</h1>
          <p className="text-gray-500 font-medium text-lg">Pay your utility bills and recharge connections instantly.</p>
        </div>
        <div className="relative w-full md:w-96">
           <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
           <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search biller or category..." className="w-full h-14 pl-14 pr-6 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none shadow-sm" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Categories */}
        <div className="lg:col-span-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredCategories.map((cat, i) => <motion.button key={cat.id} whileHover={{
            y: -5
          }} onClick={() => setSelectedBiller(cat)} className="relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center gap-4 cursor-pointer">
                   {isAdmin && <div onClick={e => {
              e.stopPropagation();
              window.location.href = `/admin/products?edit=${cat.id}`;
            }} className="absolute top-4 left-4 bg-purple-50 text-[#7C3AED] hover:text-purple-900 p-1.5 rounded-lg text-[10px] z-10 transition-all shadow-sm flex items-center cursor-pointer border border-purple-100" title="Edit Biller">
                       <Edit2 size={12} />
                     </div>}
                   <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm", cat.color)}>
                      <cat.icon size={24} />
                   </div>
                   <span className="text-xs font-bold text-gray-900 text-center">{cat.label}</span>
                </motion.button>)}
              <motion.button whileHover={{
            y: -5
          }} onClick={() => triggerToast('All remaining 30+ billing departments are aggregated under these primary nodes.')} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center gap-4 cursor-pointer">
                 <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-400 group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                 </div>
                 <span className="text-xs font-bold text-gray-900 text-center">View More</span>
              </motion.button>
           </div>

           {/* Promotional Banner */}
           <div className="mt-12 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl">
              <div className="relative z-10 max-w-lg space-y-6">
                 <span className="text-purple-200 text-[10px] font-bold uppercase tracking-[0.4em]">Limited Offer</span>
                 <h2 className="text-4xl font-black leading-tight">Get 10% Cashback on <br /> your first electricity bill.</h2>
                 <p className="text-purple-100 font-medium text-lg">Use code <span className="bg-white/20 px-3 py-1 rounded-lg text-white">POWERPLAY</span> at checkout.</p>
                 <button onClick={() => setSelectedBiller(BILL_CATEGORIES[1])} className="h-14 px-8 bg-white text-[#7C3AED] rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl cursor-pointer">
                   Pay Bill Now
                 </button>
              </div>
              <Zap className="absolute right-[-40px] bottom-[-40px] w-80 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-[5s]" size={320} />
           </div>
        </div>

        {/* Recent & Reminders */}
        <div className="lg:col-span-4 space-y-12">
           <div className="space-y-6">
              <div className="flex justify-between items-center px-4 font-sans">
                 <h3 className="text-xl font-bold text-gray-900">Recent Payments</h3>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Auto Alerts</span>
              </div>
              <div className="space-y-4">
                 
                 {/* 1. BSNL Fiber (Dynamic Payment Row) */}
                 <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group h-24">
                    <div className="flex items-center gap-4">
                       <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", !bsnlFeePaid ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400')}>
                          <Wifi size={20} />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-gray-900">BSNL Fiber</h4>
                          <p className={cn("text-[10px] font-bold uppercase tracking-widest", !bsnlFeePaid ? 'text-red-500' : 'text-emerald-500')}>
                            {!bsnlFeePaid ? 'Due in 3 days' : 'Settle Paid'}
                          </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-gray-900">₹ 1,299</p>
                       {!bsnlFeePaid ? <button onClick={handlePayDueBsnl} className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest mt-1 hover:underline cursor-pointer">
                           Pay Now
                         </button> : <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Settled</span>}
                    </div>
                 </div>

                 {/* 2. Adani Bill */}
                 <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group h-24">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 shrink-0">
                          <Zap size={20} />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-gray-900">Adani Electricity</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Paid on 10 Oct</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-gray-900">₹ 4,500</p>
                       <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">Paid</span>
                    </div>
                 </div>

                 {/* 3. Airtel Mobile */}
                 <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group h-24">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 shrink-0">
                          <Smartphone size={20} />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-gray-900">Airtel Mobile</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Paid on 05 Oct</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-gray-900">₹ 799</p>
                       <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">Paid</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Security Banner */}
           <div className="bg-[#F8FAFC] rounded-[2.5rem] p-8 border border-gray-100 flex items-center gap-6 group hover:border-[#7C3AED]/30 transition-colors">
              <div className="w-12 h-12 bg-white border border-gray-100 flex items-center justify-center shrink-0 rounded-2xl shadow-sm text-green-500">
                 <CreditCard size={20} />
              </div>
              <div>
                 <h4 className="text-xs font-bold text-gray-900 mb-1 font-sans">Secure Transactions</h4>
                 <p className="text-xs font-medium text-gray-400 leading-relaxed font-sans">Your payment information is encrypted with advanced military-grade AES standards.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Custom Utility Checkout Modal Drawer */}
      <AnimatePresence>
        {selectedBiller && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative p-10 space-y-6">
              {/* Close Button */}
              <button onClick={() => setSelectedBiller(null)} className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer">
                <X size={18} />
              </button>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-purple-50 text-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-2">
                  <selectedBiller.icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedBiller.label}</h3>
                <p className="text-xs text-gray-400">Instantly settled via secure digital wallet ledger.</p>
              </div>

              <form onSubmit={handleCustomBillSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Billing Identifier / Account</label>
                  <input type="text" required value={billerInput} onChange={e => setBillerInput(e.target.value)} className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all font-mono" placeholder={selectedBiller.placeholder} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bill Amount (INR)</label>
                  <input type="number" required value={billAmount} onChange={e => setBillAmount(e.target.value)} className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all" placeholder="₹ 499" min="1" />
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-gray-500 px-2 pt-2 leading-none">
                  <span>Balance:</span>
                  <span>₹ {balance.toLocaleString('en-IN', {
                  minimumFractionDigits: 2
                })}</span>
                </div>

                <button type="submit" className="w-full h-14 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer mt-2">
                  Confirm & Pay (₹{billAmount})
                </button>
              </form>
            </motion.div>
          </div>}
      </AnimatePresence>

      {isAdmin && <button onClick={() => window.location.href = '/admin/products?openAdd=true'} className="fixed bottom-24 right-8 bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-xl shadow-purple-600/20 flex items-center gap-2 transition-all z-40 hover:scale-105 cursor-pointer">
          <Plus size={16} />
          <span>+ Add Biller</span>
        </button>}
    </div>;
}