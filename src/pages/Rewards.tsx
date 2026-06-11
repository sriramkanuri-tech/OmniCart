import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, Percent, Award, Ticket, Copy, Check, Eye, HeartPulse, 
  ShieldCheck, Plane, Utensils, ShoppingCart, ShoppingBag, Grid, 
  Clock, CheckCircle2, ChevronRight, Sparkles, X 
} from 'lucide-react';
import { useGlobalState, Reward, Order } from '@/src/hooks/useGlobalState';
import { cn } from '@/src/lib/utils';

export default function Rewards() {
  const { rewards, points, claimReward, orders } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'rewards' | 'orders'>('rewards');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const handleCopyCode = (id: string, code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Convert status to styling
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'success':
      case 'active':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'preparing':
      case 'in transit':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'scheduled':
      case 'confirmed':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-150';
    }
  };

  // Get corresponding icon
  const getOrderIcon = (type: string) => {
    switch (type) {
      case 'food':
        return <Utensils size={18} className="text-orange-500" />;
      case 'shopping':
        return <ShoppingCart size={18} className="text-blue-500" />;
      case 'flight':
      case 'package':
        return <Plane size={18} className="text-purple-500" />;
      case 'health':
        return <HeartPulse size={18} className="text-rose-500" />;
      case 'insurance':
        return <ShieldCheck size={18} className="text-[#7C3AED]" />;
      default:
        return <ShoppingBag size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-12 pb-12 font-sans relative">
      {/* Dynamic Toast Copy Notice */}
      <AnimatePresence>
        {copiedId && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl font-bold text-sm text-white bg-emerald-600"
          >
            <Check size={18} />
            <span>Coupon Code Copied!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Rewards Center</h1>
          <p className="text-gray-500 font-medium text-lg">Earn points and unlock prime cashbacks for every transaction on the OmniCart network.</p>
        </div>

        {/* View Toggle tabs inside page to see Rewards or Orders easily */}
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm shrink-0">
           {([
             { id: 'rewards', label: 'Cashbacks & Vouchers' },
             { id: 'orders', label: `Track Orders (${orders.length})` }
           ] as const).map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                 activeTab === tab.id ? "bg-[#7C3AED] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
               )}
             >
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-xl flex flex-col justify-between min-h-[250px]">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-200">
                <Sparkles size={16} />
                <span>Loyalty tier state</span>
              </div>
              <h2 className="text-5xl font-black">Gold Member</h2>
              <p className="text-purple-100 max-w-sm text-sm font-semibold">Earned on high-fidelity transactions inside London, Switzerland, and Bangalore services.</p>
            </div>
            
            <div className="relative z-10 flex flex-wrap gap-8 pt-6 border-t border-white/10 mt-6 select-none leading-none">
              <div>
                <p className="text-[10px] text-purple-300 font-bold uppercase mb-1">Unspent Points</p>
                <p className="text-3xl font-black">{points} pts</p>
              </div>
              <div>
                <p className="text-[10px] text-purple-300 font-bold uppercase mb-1">Active Vouchers</p>
                <p className="text-3xl font-black">{rewards.filter(r => r.status === 'Available').length} claimable</p>
              </div>
              <div>
                <p className="text-[10px] text-purple-300 font-bold uppercase mb-1">Total Savings</p>
                <p className="text-3xl font-black">₹4,250</p>
              </div>
            </div>
            <Gift className="absolute right-[-40px] bottom-[-40px] w-64 text-purple-400/20 rotate-12 pointer-events-none" size={256} />
         </div>

         {/* Points progress dial */}
         <div className="bg-[#FFF9F3] border border-orange-100 rounded-[3rem] p-10 flex flex-col justify-between shadow-sm min-h-[250px]">
            <div className="space-y-4">
               <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Award size={24} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 leading-tight">Next milestone</h3>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Accumulate 300 points for Platinum transition</p>
            </div>
            
            <div className="space-y-2 pt-6">
              <div className="w-full bg-orange-100 h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (points / 300) * 100)}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-black text-orange-600 tracking-wider uppercase">
                <span>{points} earned</span>
                <span>300 pts goal</span>
              </div>
            </div>
         </div>
      </div>

      {/* Main Tab Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'rewards' ? (
          <motion.section 
            key="rewards_section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center px-4">
              <h3 className="text-xl font-bold text-gray-900">Your Cashback & Coupon Chest</h3>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rewards auto-unlock on order launch</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rewards.map((rew) => (
                <motion.div
                  key={rew.id}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden flex flex-col justify-between group",
                    rew.status === 'Claimed' && "opacity-75"
                  )}
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                        rew.status === 'Claimed' 
                          ? "bg-gray-100 text-gray-400" 
                          : "bg-purple-50 text-[#7C3AED]"
                      )}>
                        {rew.status === 'Claimed' ? <CheckCircle2 size={20} /> : <Percent size={20} />}
                      </div>
                      <span className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                        rew.status === 'Claimed' 
                          ? "bg-gray-100 text-gray-500 border border-gray-150" 
                          : "bg-purple-50 text-[#7C3AED] border border-purple-100"
                      )}>
                        {rew.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xl font-black text-gray-900 group-hover:text-[#7C3AED] transition-colors leading-tight">{rew.title}</h4>
                      <p className="text-xs font-semibold text-gray-400 leading-relaxed">{rew.desc}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
                    {rew.status === 'Available' ? (
                      <>
                        <button 
                          onClick={() => {
                            claimReward(rew.id);
                            setSelectedReward(rew);
                          }}
                          className="px-6 h-11 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                        >
                          Claim Code
                        </button>
                        <span className="text-[10px] text-gray-450 font-bold uppercase tracking-wider">+ {rew.points} pts</span>
                      </>
                    ) : (
                      <>
                        {rew.code ? (
                          <button 
                            onClick={() => handleCopyCode(rew.id, rew.code)}
                            className="flex items-center gap-2 px-5 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs text-left grow justify-center cursor-pointer transition-colors"
                          >
                            <span className="font-mono tracking-wider text-[11px] font-black">{rew.code}</span>
                            <Copy size={12} className="text-gray-450 shrink-0" />
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Voucher Claimed</span>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section 
            key="orders_section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 animate-fade-in"
          >
            <div className="flex justify-between items-center px-4">
              <h3 className="text-xl font-bold text-gray-900">Your Order History LEDGER</h3>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Respective purchases list</span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100 shadow-sm max-w-md mx-auto space-y-4">
                 <p className="text-lg font-bold text-gray-900">No Orders logged yet</p>
                 <p className="text-xs font-semibold text-gray-400">Order from our modules to view respective status listings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {orders.map((ord) => (
                  <motion.div
                    key={ord.id}
                    className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-6"
                  >
                    {ord.image ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-50 bg-gray-50">
                        <img src={ord.image} alt={ord.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl shrink-0 bg-gray-55 border border-gray-100 flex items-center justify-center text-[#7C3AED]">
                        {getOrderIcon(ord.type)}
                      </div>
                    )}
                    
                    <div className="space-y-1.5 flex-1 leading-none select-none">
                       <div className="flex justify-between items-start gap-4">
                          <h4 className="text-md font-bold text-gray-950 line-clamp-1">{ord.title}</h4>
                          <span className="text-xs font-black text-[#7C3AED]">₹{ord.amount.toLocaleString('en-IN')}</span>
                       </div>
                       <p className="text-[11px] font-semibold text-gray-450 leading-relaxed line-clamp-1">{ord.subtitle}</p>
                       <div className="flex items-center gap-3 pt-2">
                         <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", getStatusStyle(ord.status))}>
                           {ord.status}
                         </span>
                         <span className="text-[9px] font-bold text-gray-405 uppercase tracking-wider">{ord.date} • {ord.id}</span>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* VOUCHER CELEBRATION MODAL */}
      <AnimatePresence>
        {selectedReward && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative p-10 space-y-6 text-center"
            >
              <button 
                onClick={() => setSelectedReward(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-20 h-20 bg-purple-50 text-[#7C3AED] rounded-full flex items-center justify-center mx-auto shadow-md">
                 <Ticket size={36} className="animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-purple-650 bg-purple-50 px-3 py-1 rounded-full">Reward Unlocked</span>
                <h3 className="text-2xl font-black text-gray-900 pt-2">{selectedReward.title}</h3>
                <p className="text-xs font-semibold text-gray-400 leading-relaxed px-2">Copy the authorized transactional coupon value below to apply rewards at designated merchants.</p>
              </div>

              {selectedReward.code && (
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between gap-4 font-mono select-all">
                  <span className="text-sm font-black tracking-wider text-gray-950">{selectedReward.code}</span>
                  <button 
                    onClick={() => handleCopyCode(selectedReward.id, selectedReward.code)}
                    className="p-2 bg-white text-gray-500 hover:text-[#7C3AED] rounded-lg border border-gray-100 hover:shadow-sm"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}

              <button 
                onClick={() => setSelectedReward(null)}
                className="w-full h-14 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100"
              >
                Dismiss & View Chest
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
