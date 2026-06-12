import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, QrCode, Plus, Send, Landmark, History, ShieldCheck, ArrowUpRight, ArrowDownLeft, ChevronRight, Award, TrendingUp, ArrowRight, MoreHorizontal, CheckCircle2, XCircle, AlertTriangle, X, Camera, Link as LinkIcon, Lock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useGlobalState } from '@/src/hooks/useGlobalState';
export default function WalletPage() {
  const {
    balance,
    transactions,
    updateBalance,
    addTransaction,
    bankAccounts,
    cards,
    addBankAccount,
    addCard,
    isLoading
  } = useGlobalState();

  // Modals state
  const [activeModal, setActiveModal] = useState(null);

  // Camera video ref and stream ref
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  // Form inputs
  const [addAmount, setAddAmount] = useState('5000');
  const [addBank, setAddBank] = useState('HDFC Bank');
  const [sendUpi, setSendUpi] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendError, setSendError] = useState('');
  const [scanAmount, setScanAmount] = useState('');
  const [scanMerchant, setScanMerchant] = useState('Blue Tokai Coffee');
  const [withdrawBank, setWithdrawBank] = useState('State Bank of India');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  // Link Bank form inputs
  const [newBankName, setNewBankName] = useState('HDFC Bank');
  const [newBankNumber, setNewBankNumber] = useState('');
  const [newBankType, setNewBankType] = useState('Savings');
  const [newBankHolder, setNewBankHolder] = useState('Aarav Sharma');

  // Bank Link verification states
  const [bankOtpStep, setBankOtpStep] = useState(false);
  const [bankOtpCode, setBankOtpCode] = useState('');
  const [enteredBankOtp, setEnteredBankOtp] = useState('');
  const [pendingBankDetails, setPendingBankDetails] = useState(null);
  const [bankOtpError, setBankOtpError] = useState('');

  // Link Card form inputs
  const [newCardHolder, setNewCardHolder] = useState('Aarav Sharma');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardType, setNewCardType] = useState('Visa');

  // Notification Toast
  const [toast, setToast] = useState({
    show: false,
    msg: '',
    type: 'success'
  });

  // Handle camera streaming
  React.useEffect(() => {
    let active = true;
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment'
          }
        });
        if (active && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.warn('Real camera stream not initialized in sandbox container:', err);
      }
    }
    if (activeModal === 'scan') {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [activeModal]);
  const showToast = (msg, type = 'success') => {
    setToast({
      show: true,
      msg,
      type
    });
    setTimeout(() => setToast(prev => ({
      ...prev,
      show: false
    })), 3000);
  };
  const handleAddMoneySubmit = e => {
    e.preventDefault();
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) return;
    const newBalance = balance + amt;
    updateBalance(newBalance);
    addTransaction({
      title: `Added via ${addBank}`,
      subtitle: `Wallet top-up • Just now`,
      amount: amt,
      type: 'in',
      status: 'Success'
    });
    setActiveModal(null);
    showToast(`₹${amt.toLocaleString('en-IN')} added successfully!`);
    setAddAmount('5000');
  };
  const handleSendMoneySubmit = e => {
    e.preventDefault();
    const amt = parseFloat(sendAmount);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > balance) {
      setSendError('Insufficient funds in your OmniCart Wallet!');
      return;
    }
    const newBalance = balance - amt;
    updateBalance(newBalance);
    addTransaction({
      title: `Sent to ${sendUpi || 'UPI Account'}`,
      subtitle: `UPI Transfer • Just now`,
      amount: amt,
      type: 'out',
      status: 'Success'
    });
    setActiveModal(null);
    showToast(`₹${amt.toLocaleString('en-IN')} sent to ${sendUpi}!`);
    setSendAmount('');
    setSendUpi('');
    setSendError('');
  };
  const handleScanPaySubmit = e => {
    e.preventDefault();
    const amt = parseFloat(scanAmount);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > balance) {
      showToast('Transaction refused: Insufficient wallet balance!', 'refused');
      return;
    }
    const newBalance = balance - amt;
    updateBalance(newBalance);
    addTransaction({
      title: scanMerchant,
      subtitle: `QR Code Merchant • Just now`,
      amount: amt,
      type: 'out',
      status: 'Success'
    });
    setActiveModal(null);
    showToast(`Paid ₹${amt.toLocaleString('en-IN')} to ${scanMerchant}!`);
    setScanAmount('');
  };
  const handleWithdrawSubmit = e => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > balance) {
      setWithdrawError('Cannot withdraw more than your available balance!');
      return;
    }
    const newBalance = balance - amt;
    updateBalance(newBalance);
    addTransaction({
      title: `Withdrawal to ${withdrawBank}`,
      subtitle: `Settlement • Just now`,
      amount: amt,
      type: 'out',
      status: 'Success'
    });
    setActiveModal(null);
    showToast(`Withdrew ₹${amt.toLocaleString('en-IN')} to ${withdrawBank}!`);
    setWithdrawAmount('');
    setWithdrawError('');
  };
  const handleLinkBankSubmit = e => {
    e.preventDefault();
    if (!newBankNumber) return;
    const cleanNum = newBankNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4) || '1111';
    const maskedNumber = `•••• ${last4}`;

    // Generate secure 6-digit verification code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setBankOtpCode(generatedOtp);
    setPendingBankDetails({
      bankName: newBankName,
      accountNumber: maskedNumber,
      accountType: newBankType,
      holderName: newBankHolder
    });
    setBankOtpStep(true);
    setEnteredBankOtp('');
    setBankOtpError('');

    // Simulated provider dispatch toast
    showToast(`OTP sent to your mobile number registered with ${newBankName}!`);
  };
  const handleVerifyBankOtpSubmit = e => {
    e.preventDefault();
    if (!pendingBankDetails) return;
    if (enteredBankOtp.trim() !== bankOtpCode) {
      setBankOtpError('Incorrect verification code. Please try again!');
      showToast('Incorrect verification code!', 'refused');
      return;
    }
    addBankAccount({
      bankName: pendingBankDetails.bankName,
      accountNumber: pendingBankDetails.accountNumber,
      accountType: pendingBankDetails.accountType,
      holderName: pendingBankDetails.holderName
    });

    // Reset OTP details
    setActiveModal(null);
    setBankOtpStep(false);
    setBankOtpCode('');
    setEnteredBankOtp('');
    setPendingBankDetails(null);
    setBankOtpError('');
    showToast(`${pendingBankDetails.bankName} successfully verified & linked!`);
    setNewBankNumber('');
  };
  const handleLinkCardSubmit = e => {
    e.preventDefault();
    if (!newCardNumber) return;
    const cleanNum = newCardNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4) || '9999';
    const maskedCard = `•••• •••• •••• ${last4}`;
    addCard({
      cardHolder: newCardHolder,
      cardNumber: maskedCard,
      expiry: newCardExpiry,
      cvv: newCardCvv,
      cardType: newCardType
    });
    setActiveModal(null);
    showToast(`${newCardType} Card ended with ${last4} linked successfully!`);
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvv('');
  };
  if (isLoading) {
    return <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-black text-gray-405 uppercase tracking-widest">Securing secure ledger...</p>
      </div>;
  }
  return <div className="space-y-12 pb-12 font-sans relative">
      {/* Toast alert indicator */}
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
      }} className={cn("fixed top-24 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl font-bold text-sm text-white", toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600')}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span>{toast.msg}</span>
          </motion.div>}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">My Wallet</h1>
          <p className="text-gray-500 font-medium text-lg">Manage your money, link your bank account and view transactions.</p>
        </div>
        {bankAccounts.length > 0 && <div className="flex gap-4">
             <button onClick={() => {
          setAddAmount('5000');
          setActiveModal('add');
        }} className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 group transition-all transform active:scale-95 cursor-pointer">
                <Plus size={18} />
                <span>Add Money</span>
             </button>
             <button className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#7C3AED] transition-colors shadow-sm"><MoreHorizontal size={20} /></button>
          </div>}
      </div>

      {/* Dynamic Link Bank Block View */}
      {bankAccounts.length === 0 ? <div className="flex flex-col items-center justify-center mt-12 gap-8 w-full max-w-[900px] mx-auto">
          <div className="w-full rounded-[1.5rem] border border-dashed border-purple-300 bg-transparent py-20 flex flex-col items-center justify-center text-center space-y-6">
             
             <div className="relative inline-flex items-center justify-center w-32 h-32 bg-[#F3E8FF] rounded-full mb-2">
                <Landmark size={64} className="text-[#7C3AED]" strokeWidth={2} />
                <div className="absolute bottom-1 right-1 w-9 h-9 bg-[#7C3AED] rounded-full flex items-center justify-center border-4 border-white">
                   <LinkIcon size={16} className="text-white" strokeWidth={2.5} />
                </div>
             </div>
             
             <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your wallet is empty</h2>
                <p className="text-gray-500 font-medium text-[15px] leading-relaxed max-w-[320px] mx-auto">
                   Link your bank account to add money, make payments and manage transactions.
                </p>
             </div>
             
             <div className="pt-2">
                <button onClick={() => setActiveModal('link_bank')} className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-semibold text-sm transition-all active:scale-95 cursor-pointer">
                   <LinkIcon size={16} strokeWidth={2} />
                   <span>Link Your Bank Account</span>
                </button>
             </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
             <Lock size={14} />
             <span className="text-[13px] font-medium">Your data is 100% secure and encrypted.</span>
          </div>
        </div> : <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fadeIn">
           {/* Left Column: Card & Quick Actions */}
           <div className="lg:col-span-8 space-y-12">
              {/* Primary Card */}
              <div className="relative h-[300px] w-full rounded-[3rem] bg-gradient-to-br from-gray-900 via-gray-950 to-black p-12 text-white overflow-hidden shadow-2xl group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7C3AED]/20 rounded-full -ml-24 -mb-24 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                 
                 <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Total Balance</p>
                          <h2 className="text-5xl font-black tracking-tight select-none">
                            ₹ {balance.toLocaleString('en-IN', {
                    minimumFractionDigits: 2
                  })}
                          </h2>
                       </div>
                       <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#7C3AED]/20 transition-all transition-colors duration-300">
                          <CreditCard size={28} className="text-[#a78bfa]" />
                       </div>
                    </div>

                    <div className="flex justify-between items-end">
                       <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm font-medium tracking-[0.2em] text-white/60">
                             <span>****</span>
                             <span>****</span>
                             <span>****</span>
                             <span>9012</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                             <ShieldCheck size={14} className="text-[#a78bfa]" />
                             <span>Encrypted Settlement Active</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Elite Card</p>
                          <div className="h-8 w-12 bg-white/10 rounded-lg backdrop-blur flex items-center justify-center italic font-black text-[10px]">VISA</div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[{
            type: 'send',
            icon: Send,
            label: 'Send',
            color: 'bg-purple-100 text-[#7C3AED]'
          }, {
            type: 'scan',
            icon: QrCode,
            label: 'Scan & Pay',
            color: 'bg-orange-100 text-orange-600'
          }, {
            type: 'withdraw',
            icon: Landmark,
            label: 'Withdraw',
            color: 'bg-blue-100 text-blue-600'
          }, {
            type: 'ledger',
            icon: History,
            label: 'Ledger',
            color: 'bg-gray-100 text-gray-900'
          }].map((action, i) => <button key={i} onClick={() => {
            if (action.type === 'ledger') {
              const el = document.getElementById('ledger-transactions-section');
              el?.scrollIntoView({
                behavior: 'smooth'
              });
            } else {
              setActiveModal(action.type);
            }
          }} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center gap-4 cursor-pointer">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm", action.color)}>
                         <action.icon size={24} />
                      </div>
                      <span className="text-xs font-bold text-gray-900">{action.label}</span>
                   </button>)}
              </div>

              {/* Transaction History Section */}
              <div id="ledger-transactions-section" className="space-y-8 scroll-mt-24">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Feed</span>
                 </div>

                 <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                   {transactions.length === 0 ? <div className="p-12 text-center text-gray-400 font-semibold text-sm">No transaction activities yet.</div> : transactions.map((tx, i) => <div key={tx.id} className={cn("flex items-center justify-between p-8 hover:bg-gray-50 transition-all cursor-pointer group", i !== transactions.length - 1 && "border-b border-gray-50")}>
                         <div className="flex items-center gap-6">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform", tx.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-gray-150 text-gray-700')}>
                               {tx.type === 'in' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                               <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#7C3AED] transition-colors">{tx.title}</h4>
                               <p className="text-xs font-medium text-gray-400">{tx.subtitle}</p>
                            </div>
                         </div>
                         <div className="text-right space-y-1">
                            <p className={cn("text-xl font-bold tracking-tight", tx.type === 'in' ? 'text-green-600' : 'text-gray-900')}>
                              {tx.type === 'in' ? '+' : '-'} ₹ {tx.amount.toLocaleString('en-IN')}
                            </p>
                            <div className="flex items-center justify-end gap-1.5">
                               <div className={cn("w-1.5 h-1.5 rounded-full", tx.type === 'in' ? 'bg-green-500' : 'bg-gray-400')} />
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tx.status}</span>
                            </div>
                         </div>
                       </div>)}
                 </div>
              </div>
           </div>

           {/* Right Column: Cards & Rewards */}
           <div className="lg:col-span-4 space-y-12">
               {/* Rewards Widget */}
               <div className="bg-[#7C3AED] rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative z-10 space-y-8">
                     <div className="flex items-center gap-3">
                        <Award size={20} className="text-purple-200" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Aurelian Rewards</span>
                     </div>
                     <div className="space-y-1">
                        <p className="text-purple-200 text-xs font-medium">Accumulated Points</p>
                        <h2 className="text-5xl font-black tabular-nums">2,450</h2>
                     </div>
                     <div className="pt-6 border-t border-white/10">
                        <button onClick={() => showToast('Rewards center updated! Successfully claimed 500 Gold Coins.')} className="w-full h-14 bg-white text-[#7C3AED] rounded-2xl font-bold text-sm shadow-xl hover:bg-gray-50 transition-all cursor-pointer">
                          Redeem Points
                        </button>
                     </div>
                  </div>
               </div>

               {/* Linked Bank Accounts Section */}
               <div className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                     <h3 className="text-lg font-bold text-gray-900">Linked Bank Accounts</h3>
                     <button onClick={() => setActiveModal('link_bank')} className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer">
                       + Link Bank
                     </button>
                  </div>
                  
                  <div className="space-y-4">
                    {bankAccounts.map(bank => <div key={bank.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-purple-200 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-purple-50 text-[#7C3AED] rounded-xl flex items-center justify-center">
                                <Landmark size={20} />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-gray-900">{bank.bankName}</h4>
                                <p className="text-xs font-medium text-gray-400">{bank.accountType} • {bank.accountNumber}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
                          </div>
                       </div>)}
                  </div>
               </div>

               {/* Linked Cards Section */}
               <div className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                     <h3 className="text-lg font-bold text-gray-900">Linked Cards</h3>
                     <button onClick={() => setActiveModal('link_card')} className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer">
                       + Link Card
                     </button>
                  </div>
                  
                  <div className="space-y-4">
                    {cards.map(card => <div key={card.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-purple-200 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                <CreditCard size={20} />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-gray-900">{card.cardNumber}</h4>
                                <p className="text-xs font-medium text-gray-400">{card.cardType} • Exp: {card.expiry}</p>
                             </div>
                          </div>
                          <ChevronRight size={18} className="text-gray-300 group-hover:text-[#7C3AED] transition-all" />
                       </div>)}
                  </div>
               </div>

               {/* Smart Banner */}
               <div className="bg-[#FFF5F1] rounded-[3rem] p-10 border border-orange-100 group cursor-pointer">
                  <div className="space-y-6">
                     <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
                     <h4 className="text-2xl font-bold text-gray-900 leading-tight">Insight: You spent 20% more on <span className="text-orange-600 italic">Travel</span> this month.</h4>
                     <button className="text-sm font-bold text-orange-600 flex items-center gap-2 group/btn">
                        View Breakdown <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-all" />
                     </button>
                  </div>
               </div>
           </div>
         </div>}

      {/* Modal Overlays Layout */}
      <AnimatePresence>
        {activeModal && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative">
              {/* Close Button */}
              <button onClick={() => {
            setActiveModal(null);
            setSendError('');
            setWithdrawError('');
            setBankOtpStep(false);
            setBankOtpCode('');
            setEnteredBankOtp('');
            setPendingBankDetails(null);
            setBankOtpError('');
          }} className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer">
                <X size={18} />
              </button>

              {/* 1. Add Money Modal */}
              {activeModal === 'add' && <form onSubmit={handleAddMoneySubmit} className="p-10 space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">Add Money to Wallet</h3>
                    <p className="text-xs text-gray-400 font-medium">Funds will be fetched from your linked checking account.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Select or Enter Amount (INR)</label>
                      <input type="number" required value={addAmount} onChange={e => setAddAmount(e.target.value)} className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 hover:border-gray-200 transition-all" placeholder="₹ 5,000" min="1" />
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {['1000', '2000', '5000', '10000'].map(val => <button key={val} type="button" onClick={() => setAddAmount(val)} className="h-10 border border-gray-100 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 rounded-lg transition-all">
                            + ₹{parseInt(val).toLocaleString()}
                          </button>)}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Select Linked Bank Account</label>
                      {bankAccounts.length === 0 ? <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl text-xs text-yellow-700 font-medium flex items-center justify-between">
                          <span>No linked accounts found. Please link a bank account.</span>
                          <button type="button" onClick={() => setActiveModal('link_bank')} className="text-xs font-bold text-[#7C3AED] hover:underline">
                            Link Now
                          </button>
                        </div> : <select value={addBank} onChange={e => setAddBank(e.target.value)} className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all cursor-pointer">
                          {bankAccounts.map(b => <option key={b.id} value={b.bankName}>{b.bankName} ({b.accountNumber})</option>)}
                        </select>}
                    </div>
                  </div>

                  <button type="submit" disabled={bankAccounts.length === 0} className="w-full h-14 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-gray-200 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                    <Plus size={16} /> Confirm & Add Funds
                  </button>
                </form>}

              {/* 2. Send Money Modal */}
              {activeModal === 'send' && <form onSubmit={handleSendMoneySubmit} className="p-10 space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">Send Money Instantly</h3>
                    <p className="text-xs text-gray-400 font-medium">Bypass fees by using Unified Payments Interface (UPI).</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Recipient UPI Identifier</label>
                      <input type="text" required value={sendUpi} onChange={e => setSendUpi(e.target.value)} className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all" placeholder="e.g. friend@upi" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Transfer Amount (INR)</label>
                      <input type="number" required value={sendAmount} onChange={e => {
                  setSendAmount(e.target.value);
                  setSendError('');
                }} className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all" placeholder="₹ 1,500" min="1" />
                    </div>

                    {sendError && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold leading-relaxed">{sendError}</span>
                      </div>}
                  </div>

                  <button type="submit" className="w-full h-14 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                    <Send size={16} strokeWidth={2.5} /> Secure Transfer
                  </button>
                </form>}

              {/* 3. Scan & Pay Modal */}
              {activeModal === 'scan' && <form onSubmit={handleScanPaySubmit} className="p-10 space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">Scan & Pay (Local Real Camera Viewport)</h3>
                    <p className="text-xs text-gray-400 font-medium">Position code scanner or enter settlement payment amount.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Camera view with real stream support */}
                    <div className="h-56 bg-slate-950 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-white p-4 border border-gray-850">
                      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-70" />
                      <div className="absolute inset-4 border-2 border-dashed border-purple-400 rounded-2xl pointer-events-none animate-pulse" />
                      
                      <div className="relative z-10 flex flex-col items-center bg-black/55 p-3.5 rounded-2xl backdrop-blur-sm text-center">
                        <Camera size={26} className="text-purple-400 animate-bounce mb-1" />
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#a78bfa]">Real Camera Active</div>
                        <div className="text-[9px] text-gray-300 mt-0.5">Recipient: <b className="text-white">{scanMerchant}</b></div>
                      </div>

                      {/* Interactive toggle for another merchant */}
                      <button type="button" onClick={() => setScanMerchant(prev => prev === 'Blue Tokai Coffee' ? 'Swiggy Food' : 'Blue Tokai Coffee')} className="absolute bottom-3 right-3 z-20 bg-white/10 hover:bg-white/20 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded text-white backdrop-blur">
                        Switch Receiver
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Paying Amount (INR)</label>
                      <input type="number" required value={scanAmount} onChange={e => setScanAmount(e.target.value)} className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all" placeholder="₹ 750" min="1" />
                    </div>
                  </div>

                  <button type="submit" className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                    <QrCode size={16} /> Pay via Wallet Balance
                  </button>
                </form>}

              {/* 4. Withdraw Modal */}
              {activeModal === 'withdraw' && <form onSubmit={handleWithdrawSubmit} className="p-10 space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">Withdraw to Bank</h3>
                    <p className="text-xs text-gray-400 font-medium">Settle secure direct deposits with no merchant transaction fees.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Withdraw Amount (INR)</label>
                      <input type="number" required value={withdrawAmount} onChange={e => {
                  setWithdrawAmount(e.target.value);
                  setWithdrawError('');
                }} className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all" placeholder="₹ 10,000" min="1" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Destination Clearing Bank</label>
                      {bankAccounts.length === 0 ? <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl text-xs text-yellow-700 font-medium flex items-center justify-between">
                          <span>No linked accounts. Please link a bank account.</span>
                          <button type="button" onClick={() => setActiveModal('link_bank')} className="text-xs font-bold text-[#7C3AED] hover:underline">
                            Link Account
                          </button>
                        </div> : <select value={withdrawBank} onChange={e => setWithdrawBank(e.target.value)} className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all cursor-pointer">
                          {bankAccounts.map(b => <option key={b.id} value={b.bankName}>{b.bankName} ({b.accountNumber})</option>)}
                        </select>}
                    </div>

                    {withdrawError && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold leading-relaxed">{withdrawError}</span>
                      </div>}
                  </div>

                  <button type="submit" disabled={bankAccounts.length === 0} className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                    <Landmark size={16} /> Transfer to Bank Account
                  </button>
                </form>}

              {/* 5. Link Bank Modal */}
              {activeModal === 'link_bank' && (!bankOtpStep ? <form onSubmit={handleLinkBankSubmit} className="p-10 space-y-6">
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-bold text-gray-900">Link Checking / Savings Bank</h3>
                      <p className="text-xs text-gray-400 font-medium">Link securely via standard banking endpoints.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bank Name</label>
                        <select value={newBankName} onChange={e => setNewBankName(e.target.value)} className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-850 focus:ring-2 focus:ring-[#7C3AED]/20">
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="State Bank of India">State Bank of India</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Account Number</label>
                        <input type="text" required value={newBankNumber} onChange={e => setNewBankNumber(e.target.value)} className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/20" placeholder="e.g. 501004392418" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Account Type</label>
                          <select value={newBankType} onChange={e => setNewBankType(e.target.value)} className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-850 focus:ring-2 focus:ring-[#7C3AED]/20">
                            <option value="Savings">Savings Account</option>
                            <option value="Checking">Checking Account</option>
                            <option value="Salary">Salary Account</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Holder Name</label>
                          <input type="text" required value={newBankHolder} onChange={e => setNewBankHolder(e.target.value)} className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-950 focus:ring-2 focus:ring-[#7C3AED]/20" placeholder="Aarav Sharma" />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full h-14 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                      <Landmark size={16} /> Send OTP Verification
                    </button>
                  </form> : <form onSubmit={handleVerifyBankOtpSubmit} className="p-10 space-y-6">
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-bold text-gray-900">OTP Security Verification</h3>
                      <p className="text-xs text-gray-400 font-medium">Please enter the security passkey provided by your banking host.</p>
                    </div>

                    {/* Simulated incoming provider notification */}
                    <div className="p-5 border border-purple-150 bg-purple-50 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-[#7C3AED]">
                        <span className="w-2 h-2 bg-purple-600 rounded-full animate-ping" />
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#7C3AED]">Simulated SMS from {pendingBankDetails?.bankName}</h4>
                      </div>
                      <p className="text-xs font-semibold text-purple-900 leading-relaxed italic">
                        "Your verification OTP code for linking Account ending in <b className="font-extrabold">{pendingBankDetails?.accountNumber?.slice(-4)}</b> is <span className="bg-purple-100 px-2 py-0.5 rounded text-purple-700 font-mono font-black text-sm">{bankOtpCode}</span>. Valid for 10 minutes. Do not share this OTP."
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block text-center">Enter 6-Digit Code</label>
                        <input type="text" required maxLength={6} value={enteredBankOtp} onChange={e => {
                  setEnteredBankOtp(e.target.value.replace(/\D/g, ''));
                  setBankOtpError('');
                }} className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl text-center text-3xl font-black tracking-[0.4em] text-gray-950 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:bg-white transition-all transition-colors placeholder:text-gray-300" placeholder="••••••" />
                      </div>

                      {bankOtpError && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
                          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold leading-relaxed">{bankOtpError}</span>
                        </div>}
                    </div>

                    <div className="flex flex-col gap-3">
                      <button type="submit" className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                        <ShieldCheck size={18} /> Verify Bank Account
                      </button>

                      <button type="button" onClick={() => {
                // Simulate OTP resend
                const reGenerated = Math.floor(100000 + Math.random() * 900000).toString();
                setBankOtpCode(reGenerated);
                setEnteredBankOtp('');
                setBankOtpError('');
                showToast(`SMS Verification Code updated: ${reGenerated}`);
              }} className="w-full h-11 border border-gray-100 bg-white hover:bg-gray-50 text-gray-500 rounded-xl font-bold text-xs transition-colors cursor-pointer">
                        Resend Code
                      </button>
                    </div>
                  </form>)}

              {/* 6. Link Card Modal */}
              {activeModal === 'link_card' && <form onSubmit={handleLinkCardSubmit} className="p-10 space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">Link Secure Debit / Credit Card</h3>
                    <p className="text-xs text-gray-400 font-medium">Link checking cards or credit limits for payments.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Card Holder Name</label>
                      <input type="text" required value={newCardHolder} onChange={e => setNewCardHolder(e.target.value)} className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/20" placeholder="Aarav Sharma" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Card Number</label>
                        <input type="text" required maxLength={19} value={newCardNumber} onChange={e => {
                    // formatting space every 4 digits
                    const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    setNewCardNumber(val);
                  }} className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/20" placeholder="4321 0982 9912 3012" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Card Type</label>
                        <select value={newCardType} onChange={e => setNewCardType(e.target.value)} className="w-full h-12 px-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-850 focus:ring-2 focus:ring-[#7C3AED]/20">
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="RuPay">RuPay</option>
                          <option value="Amex">Amex</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Expiry Date</label>
                        <input type="text" required maxLength={5} value={newCardExpiry} onChange={e => {
                    let val = e.target.value;
                    if (val.length === 2 && !val.includes('/')) {
                      val += '/';
                    }
                    setNewCardExpiry(val);
                  }} className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/20" placeholder="MM/YY" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">CVV Code</label>
                        <input type="password" required maxLength={4} value={newCardCvv} onChange={e => setNewCardCvv(e.target.value)} className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/20" placeholder="•••" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                    <CreditCard size={16} /> Link Payment Card
                  </button>
                </form>}
            </motion.div>
          </div>}
      </AnimatePresence>
    </div>;
}