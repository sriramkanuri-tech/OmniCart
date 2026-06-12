import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, ArrowRight, Briefcase, Car, Home, Heart, X, CheckCircle2, RefreshCw, Send } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useGlobalState } from '@/src/hooks/useGlobalState';
export default function Insurance() {
  const {
    balance,
    profile,
    updateBalance,
    addTransaction,
    addOrder
  } = useGlobalState();

  // Dialog Overlay managers
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Form inputs
  const [claimType, setClaimType] = useState('Motor Insurance');
  const [claimAmount, setClaimAmount] = useState('25000');
  const [claimReason, setClaimReason] = useState('Collision repair coverage');
  const [buyCategory, setBuyCategory] = useState('Home Shield');
  const [buyTerm, setBuyTerm] = useState('1 Year Coverage');

  // Interactive Toast Notifiers
  const [toast, setToast] = useState({
    show: false,
    msg: '',
    success: true
  });
  const triggerToast = (msg, isSuccess = true) => {
    setToast({
      show: true,
      msg,
      success: isSuccess
    });
    setTimeout(() => setToast(prev => ({
      ...prev,
      show: false
    })), 3500);
  };
  const handlePlaceClaim = e => {
    e.preventDefault();
    if (!claimReason || !claimAmount) {
      triggerToast('Please describe the claim reason and damage volume.', false);
      return;
    }

    // Simulate filing details
    triggerToast(`Claim loded! Ref ID: CLM-${Math.floor(100000 + Math.random() * 900000)} is under adjuster assessment.`);
    setShowClaimModal(false);
  };
  const handleBuyPolicyItem = policy => {
    if (balance < policy.price) {
      triggerToast(`Fulfillment refused: Insufficient Wallet Balance to buy ${policy.title}!`, false);
      setSelectedPolicy(null);
      return;
    }
    updateBalance(balance - policy.price);
    addTransaction({
      title: `Policy: ${policy.title}`,
      subtitle: `Settle: ${policy.val} • Just now`,
      amount: policy.price,
      type: 'out',
      status: 'Success'
    });
    addOrder({
      title: `${policy.title}`,
      subtitle: `${policy.val} Coverage Asset`,
      amount: policy.price,
      status: 'Active',
      type: 'insurance'
    });
    triggerToast(`Protected! Policy coverage "${policy.title}" has been issued to ${profile?.name || 'Aarav Sharma'}.`);
    setSelectedPolicy(null);
  };
  const handleWizardBuy = e => {
    e.preventDefault();
    const rate = buyCategory === 'Cyber Security Shield' ? 4500 : 8900;
    if (balance < rate) {
      triggerToast('Wizard setup refused: Insufficient Wallet Balance!', false);
      return;
    }
    updateBalance(balance - rate);
    addTransaction({
      title: `Protection: ${buyCategory}`,
      subtitle: `Issued: ${buyTerm} • Just now`,
      amount: rate,
      type: 'out',
      status: 'Success'
    });
    addOrder({
      title: buyCategory,
      subtitle: `Tier: ${buyTerm} Coverage`,
      amount: rate,
      status: 'Active',
      type: 'insurance'
    });
    triggerToast(`Wizard checkout complete! Authorized policy enrollment for ${buyCategory}.`);
    setShowBuyModal(false);
  };
  const POLICY_TYPES = [{
    icon: Home,
    title: 'Home Insurance',
    val: '₹ 8.5Cr Comprehensive Cover',
    price: 15000,
    color: 'bg-blue-50 text-blue-600'
  }, {
    icon: Car,
    title: 'Motor Insurance',
    val: 'Fully Active Zero-Dep Cover',
    price: 8500,
    color: 'bg-orange-50 text-orange-600'
  }, {
    icon: Heart,
    title: 'Life Insurance',
    val: '₹ 2.5Cr Wealth Trust Cover',
    price: 22000,
    color: 'bg-red-50 text-red-600'
  }, {
    icon: Briefcase,
    title: 'Business Policy',
    val: 'Elite Premium Liability Cover',
    price: 45000,
    color: 'bg-green-50 text-green-600'
  }];
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
            {toast.success ? <CheckCircle2 size={18} /> : <X size={18} className="bg-red-700 rounded-full p-0.5" />}
            <span>{toast.msg}</span>
          </motion.div>}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Insurance & Protection</h1>
          <p className="text-gray-500 font-medium text-lg">Safeguard what matters most with smart, institutional-grade wallet settlements.</p>
        </div>
        <button onClick={() => setShowBuyModal(true)} className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 group transition-all cursor-pointer active:scale-95">
           <span>Buy Protection Plan</span>
           <ArrowRight size={18} className="group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Hero Protection (Bento Group) */}
      <section className="bg-gray-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl">
         <div className="relative z-10 max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                  <Shield size={16} />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C3AED]">Active Protection Shield</span>
            </div>
            <h2 className="text-5xl font-black leading-tight">Your assets are fully secured. <span className="text-gray-400 font-medium italic">Sleep easy.</span></h2>
            <p className="text-gray-400 font-medium text-lg leading-relaxed">Institutional-grade protection for your home, health, auto fleet, and family legacy. Manage all your active coverages in one unified digital ledger.</p>
            <div className="flex flex-wrap gap-4 pt-4">
               <button onClick={() => setShowManageModal(true)} className="h-14 px-8 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all cursor-pointer">
                 Manage Auto-Renew
               </button>
               <button onClick={() => setShowClaimModal(true)} className="h-14 px-8 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10 backdrop-blur cursor-pointer">
                 File Fast Claim
               </button>
            </div>
         </div>
         <Shield className="absolute right-[-40px] bottom-[-40px] w-96 text-white/5 rotate-12" size={384} />
      </section>

      {/* Policy Categories */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-4">
           <h3 className="text-xl font-bold text-gray-900">Coverage Classes</h3>
           <span className="text-xs font-bold text-gray-400 tracking-wider">Click grid item to buy or extend coverage</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {POLICY_TYPES.map((item, i) => <motion.div key={i} whileHover={{
          y: -8
        }} onClick={() => setSelectedPolicy(item)} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col justify-between h-full">
               <div>
                 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-inner", item.color)}>
                    <item.icon size={26} />
                 </div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{item.title}</h4>
                 <p className="text-xl font-extrabold text-gray-900 group-hover:text-[#7C3AED] transition-colors leading-snug">{item.val}</p>
               </div>
               <div className="pt-8 flex items-center justify-between text-xs font-bold border-t border-gray-50 mt-8">
                  <span className="text-gray-900">₹{item.price.toLocaleString('en-IN')}/yr</span>
                  <span className="text-[#7C3AED] group-hover:translate-x-1 transition-transform">Enroll ➔</span>
               </div>
            </motion.div>)}
        </div>
      </section>

      {/* Documentation List */}
      <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-900">Recent Coverage Documents</h3>
           <button onClick={() => triggerToast('Connecting to your Secure Legal Vault... IP verified.')} className="text-sm font-bold text-[#7C3AED] hover:underline cursor-pointer">Digital Legal Vault</button>
        </div>
        <div>
          {[{
          title: 'Quarterly Risk Evaluation Report',
          type: 'Confidential Risk Audit',
          verified: 'By KPMG'
        }, {
          title: 'Asset Validation Certification - March',
          type: 'Authorized Asset Ledger',
          verified: 'By Lloyds Registry'
        }, {
          title: 'Estate Liability Coverage Briefing',
          type: 'Private Wealth Trust Annex',
          verified: 'By Sovereign Trust'
        }, {
          title: 'Policy Renewal Payment Receipt',
          type: 'Settle Invoice Statement',
          verified: 'By OmniSettle Engine'
        }].map((doc, i) => <div key={i} onClick={() => setSelectedDoc(doc.title)} className="flex items-center justify-between p-8 hover:bg-gray-50 transition-all cursor-pointer group border-b border-gray-50 last:border-0">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-purple-50 group-hover:text-[#7C3AED] transition-all">
                     <FileText size={20} />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#7C3AED] transition-colors">{doc.title}</h4>
                     <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{doc.type} • {doc.verified} • PDF</p>
                  </div>
               </div>
               <ArrowRight size={20} className="text-gray-300 group-hover:text-[#7C3AED] group-hover:translate-x-1 transition-all" />
            </div>)}
        </div>
      </section>

      {/* MODAL 1: BUY INDIVIDUAL SELECTED POLICY */}
      <AnimatePresence>
        {selectedPolicy && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
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
              <button onClick={() => setSelectedPolicy(null)} className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer">
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full">Coverage Underwrite</span>
                <h3 className="text-xl font-bold text-gray-900 pt-2">{selectedPolicy.title}</h3>
                <p className="text-xs text-gray-400">{selectedPolicy.val}</p>
              </div>

              <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-4">
                <Shield size={32} className="text-[#7C3AED] shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-gray-900">Zero-Deductible Guarantee</p>
                  <p className="text-gray-400 font-semibold leading-relaxed mt-0.5">Complimentary legal support for claims up under assessment limits.</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs font-bold">
                <div>
                  <p className="text-gray-400 uppercase mb-0.5">Annual Fee</p>
                  <p className="text-lg font-black text-gray-900">₹{selectedPolicy.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 uppercase mb-0.5">Wallet Balance</p>
                  <p className="text-xs text-[#7C3AED]">₹{balance.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <button onClick={() => handleBuyPolicyItem(selectedPolicy)} className="w-full h-14 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                Issue Policy & Settle Wallet
              </button>
            </motion.div>
          </div>}
      </AnimatePresence>

      {/* MODAL 2: BUY PLAN WIZARD */}
      <AnimatePresence>
        {showBuyModal && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
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
              <button onClick={() => setShowBuyModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer">
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-purple-650 bg-purple-50 px-3 py-1 rounded-full">Plan wizard</span>
                <h3 className="text-2xl font-bold text-gray-900 pt-2">Custom Protective Cover</h3>
              </div>

              <form onSubmit={handleWizardBuy} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Protection Domain</label>
                  <select value={buyCategory} onChange={e => setBuyCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold outline-none font-sans">
                    <option>Home Shield (Premium cover: ₹8,900)</option>
                    <option>Cyber Security Shield (Premium cover: ₹4,500)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contract Term Length</label>
                  <select value={buyTerm} onChange={e => setBuyTerm(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold outline-none' font-sans">
                    <option>1 Year Coverage</option>
                    <option>3 Year Coverage (10% Discount)</option>
                    <option>5 Year Coverage (18% Multi-year Shield)</option>
                  </select>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs font-bold">
                  <div>
                    <p className="text-gray-400 uppercase mb-0.5">Calculated Rate</p>
                    <p className="text-lg font-black text-gray-900">
                      ₹{buyCategory.startsWith('Cyber') ? '4,500' : '8,900'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 uppercase mb-0.5">Wallet Balance</p>
                    <p className="text-xs text-[#7C3AED]">₹{balance.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <button type="submit" className="w-full h-14 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                  Confirm Policy Issuance
                </button>
              </form>
            </motion.div>
          </div>}
      </AnimatePresence>

      {/* MODAL 3: FILE FAST CLAIM FORMS */}
      <AnimatePresence>
        {showClaimModal && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
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
              <button onClick={() => setShowClaimModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer">
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-orange-650 bg-orange-50 px-3 py-1 rounded-full">Adjuster Service Desk</span>
                <h3 className="text-xl font-bold text-gray-900 pt-2">File Protection Claim</h3>
              </div>

              <form onSubmit={handlePlaceClaim} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Active Policy</label>
                  <select value={claimType} onChange={e => setClaimType(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs font-bold outline-none font-sans">
                    <option>Motor Insurance</option>
                    <option>Home Insurance</option>
                    <option>Life / Trust Settlement</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Settlement Needed (₹)</label>
                  <input type="number" value={claimAmount} onChange={e => setClaimAmount(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold outline-none font-sans font-mono" placeholder="25000" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Incident description</label>
                  <textarea value={claimReason} onChange={e => setClaimReason(e.target.value)} className="w-full h-24 bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs font-semibold outline-none font-sans resize-none" placeholder="Provide incident timestamps & damage attributes..." />
                </div>

                <button type="submit" className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                  <Send size={16} /> Submit Claim to Adjuster
                </button>
              </form>
            </motion.div>
          </div>}
      </AnimatePresence>

      {/* MODAL 4: MANAGE AUTO RENEWAL AND COVERAGES */}
      <AnimatePresence>
        {showManageModal && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
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
              <button onClick={() => setShowManageModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer">
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Policy management ledger</span>
                <h3 className="text-xl font-bold text-gray-900 pt-2">Active Coverages</h3>
              </div>

              <div className="space-y-4">
                {[{
              name: 'Vehicle Auto-Renew Shield',
              val: 'Active • Renewal Oct 2026',
              key: 'veh'
            }, {
              name: 'Home Security Asset Cover',
              val: 'Active • Auto-Renew OFF',
              key: 'hom'
            }, {
              name: 'Global Dental & Health Rider',
              val: 'Active • Renewal Dec 2026',
              key: 'hlth'
            }].map((pol, idx) => <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{pol.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{pol.val}</p>
                    </div>
                    <button onClick={() => triggerToast(`Altered automatic settlement configurations for "${pol.name}"`)} className="p-2.5 hover:bg-purple-55 text-gray-400 hover:text-[#7C3AED] rounded-xl border border-gray-100">
                      <RefreshCw size={14} className="animate-spin-slow" />
                    </button>
                  </div>)}
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>

      {/* MODAL 5: LEGAL CRYPT VAULT DOCUMENT VIEWER */}
      <AnimatePresence>
        {selectedDoc && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
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
              <button onClick={() => setSelectedDoc(null)} className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer">
                <X size={18} />
              </button>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full">Encrypted Legal Vault PDF</span>
                <h3 className="text-lg font-bold text-gray-900 pt-2 leading-snug">{selectedDoc}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Secured via SHA-256 Multiway Ledger Authentication</p>
              </div>

              <div className="border border-gray-100 bg-gray-50 p-5 rounded-2xl font-mono text-[9px] text-gray-500 leading-relaxed max-h-40 overflow-y-auto no-scrollbar whitespace-pre-wrap select-none shadow-inner">
                {"--- SECURE DOCUMENT METRIC ENVELOPE ---\nsigner: SHA_ENVELOPE_METRIC_90812\nenrollment_uuid: aarav_sharma_9022718\nunderwrite_authority: London Lloyds Premium Assure\nrisk_indices: low_risk_profile\n\n[DECLARATION OF UNDERWRITE LIABILITY]\nWe certify that asset valuations correspond with audited records. Policy payouts utilize secure digital contracts routed via our OmniSettle engine inside sandbox parameters.\n\n[SEAL OF SIGNING OFFICER]\nAuthenticated on UTC 2026-06-04."}
              </div>

              <div className="flex gap-4">
                <button onClick={() => {
              triggerToast(`PDF metadata exported securely to your local downloads directory.`);
              setSelectedDoc(null);
            }} className="flex-1 h-14 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl font-bold text-xs">
                  Download Signed Copy
                </button>
                <button onClick={() => setSelectedDoc(null)} className="h-14 px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold text-xs">
                  Close
                </button>
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>
    </div>;
}