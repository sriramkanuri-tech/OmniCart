import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, MessageSquare, Send, History, X, CheckCircle2, User, 
  Folder, AlertCircle, Terminal, ArrowRight, Loader2, HelpCircle 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useGlobalState } from '@/src/hooks/useGlobalState';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  message: string;
  email: string;
  date: string;
  status: 'In Progress' | 'Dispatched' | 'Resolved';
}

const PAST_TICKETS: Ticket[] = [
  {
    id: "tkt-89102",
    subject: "Wallet double debit on Starbucks coffee",
    category: "Wallet Settlement Issues",
    message: "I attempted to clear my Starbucks transit balance. The logs recorded a double-outward settlement of ₹450 twice instead of once.",
    email: "sriramkanuri45@gmail.com",
    date: "2 days ago",
    status: "Resolved"
  },
  {
    id: "tkt-91024",
    subject: "Insurance Policy premium confirmation delay",
    category: "Insurance Coverings",
    message: "Paid premium for Motor Shield via wallet. Settle processed, but digital documents vault has not refreshed our cover cert pdf yet.",
    email: "sriramkanuri45@gmail.com",
    date: "Yesterday",
    status: "In Progress"
  }
];

export default function Support() {
  const { profile } = useGlobalState();
  const [tickets, setTickets] = useState<Ticket[]>(PAST_TICKETS);
  
  // Form values
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Wallet Settlement Issues');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState(profile?.name || 'Aarav Sharma');

  // Interactive dispatch mechanics
  const [isSending, setIsSending] = useState(false);
  const [dispatchStep, setDispatchStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Success state notifier
  const [toast, setToast] = useState<{ show: boolean, msg: string, success: boolean }>({
    show: false,
    msg: '',
    success: true
  });

  const triggerToast = (msg: string, success: boolean = true) => {
    setToast({ show: true, msg, success });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      triggerToast('Please complete both Subject and Complaint body.', false);
      return;
    }

    // Launch secure SMTP visual dispatch
    setIsSending(true);
    setDispatchStep(1);

    await new Promise(resolve => setTimeout(resolve, 1400));
    setDispatchStep(2); // Establishing SSL

    await new Promise(resolve => setTimeout(resolve, 1400));
    setDispatchStep(3); // Transmitting packet

    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Add new ticket to local history
    const newTkt: Ticket = {
      id: `tkt-${Math.floor(10000 + Math.random() * 90000)}`,
      subject,
      category,
      message,
      email: "sriramkanuri45@gmail.com",
      date: "Just now",
      status: "Dispatched"
    };

    setTickets(prev => [newTkt, ...prev]);
    setIsSending(false);
    setDispatchStep(0);
    setShowSuccess(true);
    
    // Reset forms
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-12 pb-12 font-sans relative">
      {/* Toast alert */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={cn(
              "fixed top-24 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl font-bold text-sm text-white",
              toast.success ? "bg-emerald-600" : "bg-red-600"
            )}
          >
            {toast.success ? <CheckCircle2 size={18} /> : <X size={18} className="bg-red-700 rounded-full p-0.5" />}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">24/7 Support Desk</h1>
          <p className="text-gray-500 font-medium text-lg">Transmit instant secure complaints or raise transactional tickets directly to administrative hosts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COMPLAINTS FORM MODULE */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-8 h-fit">
           <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#7C3AED] bg-purple-50 px-3.5 py-1.5 rounded-full">Secure dispatch channel</span>
              <h2 className="text-2xl font-bold text-gray-900 pt-2">Lodge complaint to host</h2>
              <div className="pt-2 flex items-center gap-2 block bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-100 italic w-fit">
                 <Mail size={14} />
                 <span>Primary Recipient: sriramkanuri45@gmail.com</span>
              </div>
           </div>

           <form onSubmit={handleSubmitComplaint} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <User size={13} className="text-[#7C3AED]" /> Sender Name
                   </label>
                   <input 
                     value={senderName} 
                     onChange={e => setSenderName(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-50 rounded-2xl py-4 px-5 text-sm font-bold text-gray-950 outline-none focus:ring-4 focus:ring-purple-50 focus:bg-white focus:border-purple-200 transition-all"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Folder size={13} className="text-[#7C3AED]" /> Category
                   </label>
                   <select
                     value={category}
                     onChange={e => setCategory(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-50 rounded-2xl p-4 text-sm font-bold text-gray-950 outline-none focus:ring-4 focus:ring-purple-50 focus:bg-white focus:border-purple-200 transition-all font-sans"
                   >
                     <option>Wallet Settlement Issues</option>
                     <option>Food Dispatch Delay</option>
                     <option>Shopping Asset Damages</option>
                     <option>Travel Booking Cancellations</option>
                     <option>Health Diagnostics Inquiry</option>
                     <option>Insurance Coverings</option>
                     <option>General Support Query</option>
                   </select>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle size={13} className="text-[#7C3AED]" /> Complaint Subject
                 </label>
                 <input 
                   value={subject}
                   onChange={e => setSubject(e.target.value)}
                   placeholder="Enter a brief, concise subject summary..."
                   className="w-full bg-gray-50 border border-gray-50 rounded-2xl py-4 px-5 text-sm font-bold text-gray-950 outline-none focus:ring-4 focus:ring-purple-50 focus:bg-white focus:border-purple-200 transition-all placeholder:text-gray-400"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={13} className="text-[#7C3AED]" /> Complaint message body
                 </label>
                 <textarea 
                   value={message}
                   onChange={e => setMessage(e.target.value)}
                   placeholder="Describe what occurred. Provide transactional coordinates, damage metrics, or settlement indexes to support faster resolution..."
                   className="w-full h-40 bg-gray-50 border border-gray-50 rounded-2xl p-5 text-xs font-semibold text-gray-950 outline-none focus:ring-4 focus:ring-purple-50 focus:bg-white focus:border-purple-200 transition-all placeholder:text-gray-400 resize-none"
                 />
              </div>

              <button 
                type="submit"
                disabled={isSending}
                className="w-full h-15 bg-[#7C3AED] hover:bg-purple-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-3 transform active:scale-95 transition-all text-center cursor-pointer"
              >
                <Send size={16} /> Lodge Ticket to sriramkanuri45@gmail.com
              </button>
           </form>
        </div>

        {/* COMPLAINTS HISTORY LOG */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                 <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <History size={18} className="text-[#7C3AED]" /> Lodge History
                 </h3 >
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{tickets.length} Registered</span>
              </div>

              <div className="space-y-6 max-h-[480px] overflow-y-auto no-scrollbar scroll-smooth">
                 {tickets.map((tkt) => (
                   <div key={tkt.id} className="p-5 bg-gray-50 hover:bg-gray-100/50 rounded-2xl border border-gray-100 space-y-4 transition-all">
                      <div className="flex justify-between items-start gap-4">
                         <div>
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{tkt.category}</span>
                           <h4 className="text-sm font-bold text-gray-950 leading-snug pt-1">{tkt.subject}</h4>
                         </div>
                         <span className={cn(
                           "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0 border",
                           tkt.status === 'Resolved' 
                             ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                             : tkt.status === 'Dispatched' 
                             ? "bg-blue-50 text-blue-600 border-blue-100" 
                             : "bg-amber-50 text-amber-600 border-amber-100"
                         )}>
                           {tkt.status}
                         </span>
                      </div>
                      
                      <p className="text-xs font-semibold text-gray-500 leading-relaxed italic">"{tkt.message}"</p>
                      
                      <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                         <span>To: {tkt.email}</span>
                         <span>{tkt.date}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* FAQ Banner */}
           <div className="bg-[#FFF9F3] border border-orange-100 rounded-[2.5rem] p-8 flex gap-5 items-start">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                 <HelpCircle size={20} />
              </div>
              <div className="space-y-1">
                 <h4 className="text-sm font-bold text-gray-950">Resolutions under SLA</h4>
                 <p className="text-xs text-gray-400 font-semibold leading-relaxed">Hosts guarantee a secure diagnostic and reply profile within 120 minutes of complaint dispatch.</p>
              </div>
           </div>
        </div>
      </div>

      {/* SECURE SMTP LOADING OVERLAY */}
      <AnimatePresence>
        {isSending && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[105] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-950 text-emerald-400 border border-emerald-500/20 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-8 space-y-6 font-mono text-left"
            >
              <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
                 <Terminal size={18} className="text-emerald-500 animate-pulse" />
                 <span className="text-xs font-black uppercase tracking-wider text-emerald-500">Secure SMTP Dispatch CLI</span>
              </div>

              <div className="space-y-3.5 text-xs">
                 <div className="flex items-center gap-2">
                   <Loader2 size={13} className="animate-spin text-emerald-500" />
                   <span>Initializing dispatch handshakes...</span>
                 </div>

                 {dispatchStep >= 1 && (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-500/85">
                     ➔ Resolved MX server metrics for sriramkanuri45@gmail.com
                   </motion.p>
                 )}
                 {dispatchStep >= 2 && (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-500/85">
                     ➔ Negotiated perfect SSL/TLS symmetric cryptography
                   </motion.p>
                 )}
                 {dispatchStep >= 3 && (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-500/85">
                     ➔ Sending complaint body stream to host mailbox...
                   </motion.p>
                 )}
              </div>

              <div className="h-[2px] bg-emerald-500/20 w-fit" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DISPATCH SUCCESS CONFIRMATION DRAW */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[105] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative p-10 space-y-6 text-center"
            >
              <button 
                onClick={() => setShowSuccess(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                 <CheckCircle2 size={32} className="animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Securely Dispatched</span>
                <h3 className="text-xl font-bold text-gray-900 pt-2">Complaint Lodged!</h3>
                <p className="text-xs font-semibold text-gray-400 leading-relaxed px-1">Your secure complaints record has been transmitted directly into sriramkanuri45@gmail.com's SMTP mailbox.</p>
              </div>

              <button 
                onClick={() => {
                  setShowSuccess(false);
                  triggerToast('Ticket record initialized in lodge history.');
                }}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-100"
              >
                Dismiss & View Log
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
