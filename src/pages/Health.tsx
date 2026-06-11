import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartPulse, Activity, Stethoscope, Droplets, FlaskConical, ArrowRight, 
  ShieldCheck, Zap, Calendar, Search, X, CheckCircle2, ChevronRight, Apple, Watch
} from 'lucide-react';
import { Button } from '@/src/components/ui/Inputs';
import { cn } from '@/src/lib/utils';
import { useGlobalState } from '@/src/hooks/useGlobalState';

export default function Health() {
  const { balance, profile, updateBalance, addTransaction, addOrder } = useGlobalState();
  
  // Interactive Modal states
  const [showAppointment, setShowAppointment] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [activeDevice, setActiveDevice] = useState<string | null>(null);

  // Form states
  const [specialist, setSpecialist] = useState('General Physician');
  const [apptDate, setApptDate] = useState('Tomorrow, 11:00 AM');

  // Interactive Toast state
  const [toast, setToast] = useState<{ show: boolean; msg: string; success: boolean }>({
    show: false,
    msg: '',
    success: true
  });

  const triggerToast = (msg: string, isSuccess: boolean = true) => {
    setToast({ show: true, msg, success: isSuccess });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  const handleBookAppt = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = 1200;
    if (balance < cost) {
      triggerToast('Appointment booking refused: Insufficient Wallet Balance!', false);
      return;
    }

    updateBalance(balance - cost);
    addTransaction({
      title: `Appt: ${specialist}`,
      subtitle: `Settle: Consultation Slot • Just now`,
      amount: cost,
      type: 'out',
      status: 'Success'
    });

    addOrder({
      title: `${specialist} Consultation`,
      subtitle: `Confirmed for ${apptDate}`,
      amount: cost,
      status: 'Scheduled',
      type: 'health'
    });

    triggerToast(`Appointment scheduled successfully! ₹${cost} paid via Wallet.`);
    setShowAppointment(false);
  };

  const handleBuyService = (service: any) => {
    if (balance < service.price) {
      triggerToast(`Order refused: Insufficient wallet balance to lease ${service.label}!`, false);
      setSelectedService(null);
      return;
    }

    updateBalance(balance - service.price);
    addTransaction({
      title: `Wellness: ${service.label}`,
      subtitle: `${service.desc} • Settle`,
      amount: service.price,
      type: 'out',
      status: 'Success'
    });

    addOrder({
      title: service.label,
      subtitle: `${service.desc}`,
      amount: service.price,
      status: 'Confirmed',
      type: 'health'
    });

    triggerToast(`Order placed successfully! ₹${service.price.toLocaleString('en-IN')} paid to Health Desk.`);
    setSelectedService(null);
  };

  // Meditation Breathing logic
  const [breathText, setBreathText] = useState('Inhale');
  const [breatheCycle, setBreatheCycle] = useState(0);

  useEffect(() => {
    if (!showMeditation) return;
    setBreathText('Inhale');
    setBreatheCycle(0);
    const interval = setInterval(() => {
      setBreathText(prev => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
      setBreatheCycle(c => c + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [showMeditation]);

  const SERVICE_OFFERINGS = [
    { icon: Stethoscope, label: 'Concierge Care', desc: 'Direct 24/7 access to world-class private specialists.', price: 12000, color: 'bg-purple-50 text-[#7C3AED]' },
    { icon: FlaskConical, label: 'Full Diagnostic Lab', desc: 'Precise screening profile diagnostic kits from home.', price: 2499, color: 'bg-blue-50 text-blue-600' },
    { icon: Droplets, label: 'IV Recovery Fluids', desc: 'Optimized hydrating solutions for instant renewal.', price: 1500, color: 'bg-cyan-50 text-cyan-600' },
    { icon: ShieldCheck, label: 'Whole Body Checkup', desc: 'Supervised comprehensive physical wellness screens.', price: 3999, color: 'bg-green-50 text-green-600' }
  ];

  return (
    <div className="space-y-12 pb-12 font-sans relative">
      {/* Toast Alert */}
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
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Health & Wellness</h1>
          <p className="text-gray-500 font-medium text-lg">Your personalized wellness companion and diagnostic command center.</p>
        </div>
        <button 
          onClick={() => setShowAppointment(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-150 transition-all cursor-pointer active:scale-95"
        >
           <Calendar size={18} />
           <span>Book Consultancy Slot</span>
        </button>
      </div>

      {/* Main Stats (Bento Group) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-[#F1F4FF] rounded-[3rem] p-12 border border-blue-100 relative overflow-hidden group shadow-sm">
            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <Activity size={20} className="text-blue-600 animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Real-time Biometrics active</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 leading-tight">Wellness Score: 92</h2>
                <p className="text-gray-500 font-medium text-lg max-w-md">Your health markers are excellent today. You are in the top 5% of active users in your age group.</p>
                <Button 
                  onClick={() => setShowReport(true)}
                  className="h-14 px-8 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold shadow-xl shadow-purple-100 cursor-pointer"
                >
                  View Detailed Biomarkers Report
                </Button>
            </div>
            <Activity className="absolute right-[-40px] bottom-[-40px] w-64 text-blue-200/30 rotate-12" size={256} />
         </div>

         <div className="bg-[#FFF5F1] rounded-[3rem] p-10 border border-orange-100 space-y-8 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                 <Zap size={28} className="animate-bounce" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-2xl font-bold text-gray-900">Recommended Action</h3>
                 <p className="text-gray-500 font-medium leading-relaxed">Based on your activity levels today, a 1-minute guided focus meditation is recommended to balance cortisol.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowMeditation(true)}
              className="text-sm font-bold text-orange-600 flex items-center gap-2 group cursor-pointer w-fit"
            >
               Start Guided Session <ArrowRight size={16} className="group-hover:translate-x-1 transition-all" />
            </button>
         </div>
      </div>

      {/* Services Grid */}
      <section className="space-y-8">
        <div className="flex justify-between items-center px-4">
           <h3 className="text-xl font-bold text-gray-900">Premium Medical Offerings</h3>
           <span className="text-xs font-bold text-gray-400 tracking-wider">Click card to purchase instantly</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICE_OFFERINGS.map((service, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -8 }}
              onClick={() => setSelectedService(service)}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col justify-between h-full"
            >
               <div>
                 <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm", service.color)}>
                    <service.icon size={28} />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#7C3AED] transition-colors mb-2 leading-snug">{service.label}</h4>
                 <p className="text-sm font-medium text-gray-400 leading-relaxed mb-6">{service.desc}</p>
               </div>
               <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-sm font-black text-gray-900">₹{service.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-bold text-[#7C3AED] group-hover:translate-x-1 transition-transform">Buy Now ➔</span>
               </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Wellness Insight Banner */}
      <section className="bg-gray-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl">
         <div className="relative z-10 max-w-2xl space-y-6">
            <h3 className="text-4xl font-bold leading-tight">Monitor your <span className="text-[#7C3AED]">Vital Signs</span> 24/7 with our OmniHealth App.</h3>
            <p className="text-gray-400 font-medium text-lg leading-relaxed">Connect your wearable device to synchronize biometric coordinates and launch smart notifications.</p>
            
            {activeDevice ? (
              <div className="p-6 bg-white/5 border border-white/10 backdrop-blur rounded-2xl w-fit flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/25 text-emerald-400 rounded-xl flex items-center justify-center"><CheckCircle2 size={20} /></div>
                <div>
                  <p className="text-sm font-bold">{activeDevice} Hub Connected</p>
                  <p className="text-[10px] text-gray-450 uppercase font-black tracking-widest">Active Heart Syncing Now</p>
                </div>
                <button onClick={() => { setActiveDevice(null); triggerToast('Wearable disconnected.'); }} className="text-xs text-red-400 font-bold hover:underline ml-6">Disconnect</button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 pt-4">
                 <button 
                   onClick={() => triggerToast('OmniHealth app installer downloaded in sandbox memory.')} 
                   className="h-14 px-8 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all cursor-pointer"
                 >
                   Download App
                 </button>
                 <button 
                   onClick={() => setActiveDevice('Apple Watch Ultra')} 
                   className="h-14 px-8 bg-[#7C3AED] text-white rounded-2xl font-bold hover:bg-purple-600 transition-all border border-purple-500/30 backdrop-blur flex items-center gap-2 cursor-pointer"
                 >
                   <Watch size={18} /> Connect Apple Watch
                 </button>
                 <button 
                   onClick={() => setActiveDevice('Fitbit sense')} 
                   className="h-14 px-8 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10 backdrop-blur cursor-pointer"
                 >
                   Connect Fitbit
                 </button>
              </div>
            )}
         </div>
         <HeartPulse className="absolute right-[-40px] bottom-[-40px] w-80 text-white/5 group-hover:scale-110 transition-transform duration-[5s]" size={320} />
      </section>

      {/* MODAL 1: BOOK CONSULTANCY */}
      <AnimatePresence>
        {showAppointment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative p-10 space-y-6"
            >
              <button 
                onClick={() => setShowAppointment(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-purple-650 bg-purple-50 px-3 py-1 rounded-full">Doctor Appointment</span>
                <p className="text-xs text-gray-500 font-semibold mt-1">Patient: <b className="text-[#7C3AED]">{profile?.name || 'Valued User'}</b> ({profile?.email || 'Registered User'})</p>
                <h3 className="text-xl font-bold text-gray-900 pt-1">Schedule consultation</h3>
              </div>

              <form onSubmit={handleBookAppt} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Specialist</label>
                  <select 
                    value={specialist} 
                    onChange={e => setSpecialist(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold outline-none font-sans"
                  >
                    <option>General Physician</option>
                    <option>Cardiologist Specialist</option>
                    <option>Dermatologist Desk</option>
                    <option>Pediatric Command</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Appointment Window</label>
                  <select 
                    value={apptDate} 
                    onChange={e => setApptDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold outline-none font-sans"
                  >
                    <option>Tomorrow, 11:00 AM</option>
                    <option>Saturday, 2:30 PM</option>
                    <option>Monday, 9:00 AM</option>
                    <option>Wednesday, 4:00 PM</option>
                  </select>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs font-bold">
                  <div>
                    <p className="text-gray-400 uppercase mb-0.5">Consultation Fee</p>
                    <p className="text-lg font-black text-gray-900">₹1,200</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 uppercase mb-0.5">Wallet Balance</p>
                    <p className="text-xs text-[#7C3AED]">₹{balance.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full h-14 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer"
                >
                  Settle & Confirm Spot
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: DETAILED HEALTH BIOMARKERS REPORT */}
      <AnimatePresence>
        {showReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative p-10 space-y-6"
            >
              <button 
                onClick={() => setShowReport(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Biomarker diagnostics</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">Comprehensive health indices</h3>
                <p className="text-xs text-gray-400">Aggregated real-time health telemetry index sync.</p>
              </div>

              <div className="space-y-4 pt-2">
                {[
                  { name: 'Heart Rate Variability', value: '78 ms', remark: 'Optimal', range: '65 - 90 ms', color: 'w-[85%] bg-green-500' },
                  { name: 'Sleep efficiency score', value: '89%', remark: 'Excellent', range: '80% - 92%', color: 'w-[89%] bg-blue-500' },
                  { name: 'Blood Oxygen (SpO2)', value: '98.8%', remark: 'Perfect', range: '95% - 100%', color: 'w-[98%] bg-cyan-500' },
                  { name: 'Cardio Fitness (VO2 Max)', value: '47.5 ml/kg', remark: 'Enviable', range: '42 - 50 ml/kg', color: 'w-[92%] bg-purple-500' },
                  { name: 'Cortisol level estimate', value: '8.4 μg/dL', remark: 'Reduced', range: '5.0 - 15.0 μg/dL', color: 'w-[56%] bg-orange-500' }
                ].map((marker, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-900">{marker.name}</span>
                      <span className="text-[#7C3AED]">{marker.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-[2s]", marker.color)} />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                      <span>Ref range: {marker.range}</span>
                      <span className="text-gray-500 uppercase">{marker.remark}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: GUIDED FOCUS MEDITATION SCREEN */}
      <AnimatePresence>
        {showMeditation && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[95] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-10 max-w-sm w-full p-8"
            >
              <div className="space-y-2">
                <span className="text-[10px] text-orange-500 font-extrabold uppercase tracking-widest bg-orange-500/10 px-4 py-2 rounded-full">Guided Focus loop</span>
                <h3 className="text-3xl font-bold text-white pt-2">Breathe & Reset</h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">Regulate cardiac rhythmic focus through oxygen pacing.</p>
              </div>

              {/* Animated breathing visualizer ring */}
              <div className="relative flex items-center justify-center h-52 w-52 mx-auto">
                <motion.div 
                  animate={{
                    scale: breathText === 'Inhale' ? 1.6 : breathText === 'Hold' ? 1.6 : 1.0,
                    opacity: breathText === 'Inhale' ? 0.35 : breathText === 'Hold' ? 0.45 : 0.15
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute pointer-events-none rounded-full h-44 w-44 bg-orange-500/20 shadow-[0_0_80px_20px_rgba(249,115,22,0.2)]"
                />
                
                <motion.div 
                  animate={{
                    scale: breathText === 'Inhale' ? 1.3 : breathText === 'Hold' ? 1.3 : 1.0
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute pointer-events-none rounded-full h-28 w-28 border-2 border-orange-500/60"
                />

                <div className="relative z-10 flex flex-col justify-center text-white">
                  <motion.p 
                    key={breathText}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="text-2xl font-black tracking-wider text-orange-400 uppercase"
                  >
                    {breathText}
                  </motion.p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Cycle {Math.max(1, Math.ceil(breatheCycle / 3))}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">Follow the expanding circle. Hold as paced, breathe comfortably.</p>
                <button 
                  onClick={() => {
                    setShowMeditation(false);
                    triggerToast('Cortisol balance reset! Earned 15 loyalty points.');
                    addOrder({
                      title: "Cortisol Focus Meditation",
                      subtitle: "1-minute guided session completed",
                      amount: 0,
                      status: "Success",
                      type: "health"
                    });
                  }}
                  className="px-10 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-500/20 cursor-pointer w-fit mx-auto"
                >
                  Complete Meditation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: MEDICAL SERVICE BUY MODAL */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative p-10 space-y-6"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-950 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-purple-650 bg-purple-50 px-3 py-1 rounded-full">Secure Settle Activation</span>
                <h3 className="text-xl font-bold text-gray-900 pt-2">{selectedService.label}</h3>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed font-semibold">{selectedService.desc}. Instant medical dispatch and direct billing.</p>

              <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-xs font-bold">
                <div>
                  <p className="text-gray-400 uppercase mb-0.5">Activation rate</p>
                  <p className="text-lg font-black text-gray-900">₹{selectedService.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 uppercase mb-0.5">Wallet Balance</p>
                  <p className="text-xs text-[#7C3AED]">₹{balance.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <button 
                onClick={() => handleBuyService(selectedService)}
                className="w-full h-14 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer"
              >
                Activate & Order (₹{selectedService.price.toLocaleString('en-IN')})
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
