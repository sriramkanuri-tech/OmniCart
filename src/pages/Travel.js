import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Train, Bus, MapPin, Calendar, Users, ArrowRight, ArrowLeftRight, Compass, ShieldCheck, Star, X, CheckCircle2, Armchair, Plus, Edit2 } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/src/components/ui/Inputs';
import { cn } from '@/src/lib/utils';
import { useGlobalState } from '@/src/hooks/useGlobalState';
const TRENDING = [{
  id: 1,
  name: 'Santorini, Greece',
  desc: 'Breathtaking views & luxury villas',
  price: '₹ 85,000+',
  rate: 85000,
  rating: '4.9',
  image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600&auto=format&fit=crop'
}, {
  id: 2,
  name: 'Kyoto, Japan',
  desc: 'Ancient temples & zen gardens',
  price: '₹ 45,999+',
  rate: 45999,
  rating: '4.8',
  image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop'
}, {
  id: 3,
  name: 'Amalfi Coast, Italy',
  desc: 'Coastal charm & fine dining',
  price: '₹ 92,000+',
  rate: 92000,
  rating: '4.9',
  image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=600&auto=format&fit=crop'
}, {
  id: 4,
  name: 'Bali, Indonesia',
  desc: 'Tropical paradise & luxury resorts',
  price: '₹ 35,000+',
  rate: 35000,
  rating: '4.7',
  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop'
}];
const FLIGHTS = [{
  id: 'EK-503',
  carrier: 'Emirates',
  dep: '10:30 AM',
  arr: '02:45 PM',
  price: 42000,
  duration: '4h 15m'
}, {
  id: 'AI-101',
  carrier: 'Air India',
  dep: '06:00 AM',
  arr: '11:15 AM',
  price: 18500,
  duration: '5h 15m'
}, {
  id: 'SQ-421',
  carrier: 'Singapore Airlines',
  dep: '09:15 PM',
  arr: '03:30 AM',
  price: 34000,
  duration: '6h 15m'
}];
const TRAINS = [{
  id: '12002',
  carrier: 'Shatabdi Express',
  dep: '06:00 AM',
  arr: '10:45 AM',
  price: 1200,
  duration: '4h 45m'
}, {
  id: '12952',
  carrier: 'Rajdhani Express',
  dep: '04:30 PM',
  arr: '08:15 AM',
  price: 2800,
  duration: '15h 45m'
}, {
  id: '22691',
  carrier: 'Rajdhani Premium AC',
  dep: '08:00 PM',
  arr: '11:30 AM',
  price: 4100,
  duration: '15h 30m'
}];
const BUSES = [{
  id: 'KA-9010',
  carrier: 'KSRTC Ambaari Sleeper',
  dep: '09:00 PM',
  arr: '06:00 AM',
  price: 1600,
  duration: '9h 00m'
}, {
  id: 'SR-441',
  carrier: 'SRS Travels Multi-Axle',
  dep: '10:15 PM',
  arr: '07:30 AM',
  price: 1450,
  duration: '9h 15m'
}, {
  id: 'VRL-772',
  carrier: 'VRL Sleeper Coach',
  dep: '07:15 PM',
  arr: '05:45 AM',
  price: 1800,
  duration: '10h 30m'
}];
export default function TravelPage() {
  const {
    balance,
    updateBalance,
    addTransaction,
    addOrder,
    profile
  } = useGlobalState();
  const isAdmin = profile?.email === "sriramkanuri4@gmail.com";
  const [trendingList, setTrendingList] = useState(TRENDING);
  useEffect(() => {
    const fetchTravelData = async () => {
      try {
        const res = await axios.get('/api/admin/products', {
          headers: {
            'x-admin-email': 'sriramkanuri4@gmail.com'
          }
        });
        if (res.data && res.data.length > 0) {
          const travelProducts = res.data.filter(p => p.category === 'Travel');
          if (travelProducts.length > 0) {
            const customTravelList = travelProducts.map(p => ({
              id: p.id,
              name: p.name,
              desc: p.description || 'Premium custom package route created inside OmniCart.',
              price: `₹ ${parseFloat(String(p.rate || p.price).replace(/[^0-9.]/g, '')).toLocaleString('en-IN')}+`,
              rate: parseFloat(String(p.rate || p.price).replace(/[^0-9.]/g, '')) || 45000,
              rating: p.rating || '4.8',
              image: p.image
            }));
            setTrendingList([...TRENDING, ...customTravelList]);
          }
        }
      } catch (err) {
        console.error('Error fetching travel data:', err);
      }
    };
    fetchTravelData();
  }, []);

  // Interactive hooks
  const [activeTab, setActiveTab] = useState('flights');

  // Search parameters
  const [origin, setOrigin] = useState('Mumbai (BOM)');
  const [destination, setDestination] = useState('London (LHR)');
  const [date, setDate] = useState('25 May 2026');
  const [passengers, setPassengers] = useState('1 Adult, Premium Economy');
  const [cabinClass, setCabinClass] = useState('Business Class');

  // Modal overlays
  const [showFlightSearch, setShowFlightSearch] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Seat booking states
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [seatMapStep, setSeatMapStep] = useState(false);
  const [chosenSeat, setChosenSeat] = useState('');
  const [bookedSeats, setBookedSeats] = useState(['1C', '2A', '3D', '5B', 'LB-3', 'UB-8', 'W-2', 'A-5']);

  // Success state notifier
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
    })), 3500);
  };
  const handleBookFlight = flight => {
    setSelectedTransport(flight);
    setSeatMapStep(true);
    setChosenSeat('');
    triggerToast(`Searching seat map for ${flight.carrier} ${flight.id}...`);
  };
  const handleConfirmSeatBooking = () => {
    if (!chosenSeat) {
      triggerToast('Please select a seat to proceed with travel booking!', false);
      return;
    }
    const price = selectedTransport.price;
    if (balance < price) {
      triggerToast('Booking failed: Insufficient funds in OmniCart Wallet!', false);
      return;
    }
    updateBalance(balance - price);
    let typeName = 'Flight';
    if (activeTab === 'trains') typeName = 'Train';
    if (activeTab === 'buses') typeName = 'Bus';
    addTransaction({
      title: `${selectedTransport.carrier} ${typeName} Booking`,
      subtitle: `${origin} ➔ ${destination} • Seat ${chosenSeat}`,
      amount: price,
      type: 'out',
      status: 'Success'
    });
    addOrder({
      title: `${selectedTransport.carrier} ${typeName} ${selectedTransport.id}`,
      subtitle: `${origin} ➔ ${destination} • Seat: ${chosenSeat} • Class: ${cabinClass}`,
      amount: price,
      status: 'Scheduled',
      type: 'flight'
    });
    triggerToast(`Booking confirmed for ${typeName} ${selectedTransport.id}! Seat: ${chosenSeat}. Paid ₹${price.toLocaleString('en-IN')}`);

    // Add to booked seats
    setBookedSeats(prev => [...prev, chosenSeat]);

    // Complete
    setShowFlightSearch(false);
    setSeatMapStep(false);
    setSelectedTransport(null);
    setChosenSeat('');
  };
  const handleBookPackage = pkg => {
    if (balance < pkg.rate) {
      triggerToast(`Booking refused: Insufficient wallet balance to sponsor journey to ${pkg.name}!`, false);
      setSelectedDestination(null);
      return;
    }
    updateBalance(balance - pkg.rate);
    addTransaction({
      title: `Holiday Package: ${pkg.name}`,
      subtitle: `Hotel & Ticket inclusions • Just now`,
      amount: pkg.rate,
      type: 'out',
      status: 'Success'
    });
    addOrder({
      title: `Holiday Package: ${pkg.name}`,
      subtitle: `${pkg.desc}`,
      amount: pkg.rate,
      status: 'Confirmed',
      type: 'package',
      image: pkg.image
    });
    triggerToast(`Holiday reservation to ${pkg.name} has been processed successfully!`);
    setSelectedDestination(null);
  };
  const handleSwapStations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };
  const getTransportList = () => {
    if (activeTab === 'trains') return TRAINS;
    if (activeTab === 'buses') return BUSES;
    return FLIGHTS;
  };
  return <div className="space-y-12 pb-12 font-sans relative">
      {/* Toast Notifier */}
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 animate-slide-up">Travel Booking</h1>
          <p className="text-gray-500 font-medium text-lg">Explore the world with premium comfort and seamless wallet settlements.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm shrink-0">
           {[{
          id: 'flights',
          label: 'Flights'
        }, {
          id: 'hotels',
          label: 'Hotels'
        }, {
          id: 'trains',
          label: 'Trains'
        }, {
          id: 'buses',
          label: 'Buses'
        }].map(tab => <button key={tab.id} onClick={() => {
          setActiveTab(tab.id);
          if (tab.id === 'flights') {
            setOrigin('Mumbai (BOM)');
            setDestination('London (LHR)');
          } else if (tab.id === 'trains') {
            setOrigin('New Delhi (NDLS)');
            setDestination('Mumbai Central (MMCT)');
          } else if (tab.id === 'buses') {
            setOrigin('Bengaluru (KBS)');
            setDestination('Goa (Panaji)');
          }
          triggerToast(`Switched interface focus to ${tab.label}`);
        }} className={cn("px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer", activeTab === tab.id ? "bg-[#7C3AED] text-white shadow-lg" : "text-gray-500 hover:bg-gray-50")}>
               {tab.label}
             </button>)}
        </div>
      </div>

      {/* Booking Widget (Bento Style) */}
      <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-10">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <MapPin size={14} className="text-[#7C3AED]" />
                  <span>From</span>
               </div>
               <div className="relative group">
                  <input value={origin} onChange={e => setOrigin(e.target.value)} className="w-full bg-gray-50 border border-gray-50 rounded-2xl py-4 px-6 text-lg font-bold text-gray-900 outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all" />
               </div>
            </div>

            <div className="space-y-4 relative">
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <MapPin size={14} className="text-[#7C3AED]" />
                  <span>To</span>
               </div>
               <div className="relative group">
                  <input value={destination} onChange={e => setDestination(e.target.value)} className="w-full bg-gray-50 border border-gray-50 rounded-2xl py-4 px-6 text-lg font-bold text-gray-900 outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all" />
               </div>
               <button type="button" onClick={handleSwapStations} className="absolute left-[-23px] top-[48px] z-10 hidden lg:flex w-[46px] h-[46px] bg-white border border-gray-100 rounded-full items-center justify-center shadow-lg text-[#7C3AED] hover:bg-purple-50 transition-colors cursor-pointer">
                  <ArrowLeftRight size={16} />
               </button>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Calendar size={14} className="text-[#7C3AED]" />
                  <span>Departure Date</span>
               </div>
               <div className="relative group">
                  <input value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-50 border border-gray-50 rounded-2xl py-4 px-6 text-lg font-bold text-gray-900 outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all" />
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Users size={14} className="text-[#7C3AED]" />
                  <span>Passengers & Config</span>
               </div>
               <div className="relative group">
                  <input value={passengers} onChange={e => setPassengers(e.target.value)} className="w-full bg-gray-50 border border-gray-50 rounded-2xl py-4 px-6 text-lg font-bold text-gray-900 outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all" />
               </div>
            </div>
         </div>

         <div className="flex flex-col md:flex-row gap-6 pt-6 border-t border-gray-50">
            <div className="flex-1 flex gap-4 overflow-x-auto no-scrollbar">
               {['Premium Economy', 'Business Class', 'First Class'].map(tier => <label key={tier} className={cn("flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-transparent", cabinClass === tier ? "border-purple-200 bg-purple-50/50" : "bg-gray-50")}>
                     <input type="radio" name="class_tier" checked={cabinClass === tier} onChange={() => setCabinClass(tier)} className="w-4 h-4 text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer" />
                     <span className="text-xs font-bold text-gray-650">{tier}</span>
                  </label>)}
            </div>
            
            <Button onClick={() => {
          if (activeTab === 'hotels') {
            setSelectedDestination(TRENDING[0]);
            return;
          }
          setSeatMapStep(false);
          setSelectedTransport(null);
          setChosenSeat('');
          setShowFlightSearch(true);
        }} className="h-16 px-16 rounded-[2rem] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-lg shadow-xl shadow-purple-200 group transition-all cursor-pointer">
               Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
               <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
         </div>
      </section>

      {/* Offers & Perks */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in animate-delay-1">
         <div className="lg:col-span-8 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-xl">
            <div className="relative z-10 max-w-lg space-y-6">
               <div className="flex items-center gap-3 animate-pulse">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Exclusive Member Benefit</span>
               </div>
               <h2 className="text-4xl font-bold leading-tight">Global Concierge <br /> Available 24/7.</h2>
               <p className="text-white/70 font-medium leading-relaxed">
                  As our elite member, you get priority boarding, complimentary luxury lounge access, and dedicated check-in fast tracks for every single journey.
               </p>
               <button type="button" onClick={() => triggerToast('Lounge Access Code: OMNI_GOLD_9012 activated!')} className="bg-white text-[#7C3AED] hover:bg-gray-50 px-8 py-3 rounded-xl text-sm font-bold shadow-lg mt-2 cursor-pointer active:scale-95 transition-all">
                 Activate Lounge Access
               </button>
            </div>
            <Compass className="absolute right-[-20px] bottom-[-20px] w-64 opacity-10 group-hover:rotate-45 transition-transform duration-[3s]" size={256} />
         </div>

         <div className="lg:col-span-4 bg-[#F1F4FF] rounded-[3rem] p-10 flex flex-col justify-between border border-blue-100 shadow-sm">
            <div className="space-y-4">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Plane size={24} /></div>
               <h3 className="text-2xl font-bold text-gray-900">Flat 10% OFF</h3>
               <p className="text-gray-500 font-medium text-sm leading-relaxed">On your first international flight booking with SBI & HDFC Credit Cards.</p>
            </div>
            <div className="pt-6 border-t border-blue-200">
               <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Use Code</p>
               <p className="text-xl font-black text-gray-900 tracking-wider">TRAVELMAX</p>
            </div>
         </div>
      </section>

      {/* Popular Destinations */}
      <section className="space-y-8 animate-fade-in animate-delay-2">
        <div className="flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-900">Popular Destinations Packages</h3>
           <button onClick={() => triggerToast('Displaying entire globally aggregated map directory.')} className="text-sm font-bold text-[#7C3AED] hover:underline">Explore All Geography</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingList.map(place => <motion.div key={place.id} whileHover={{
          y: -8
        }} onClick={() => setSelectedDestination(place)} className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
              <div className="relative h-64 overflow-hidden rounded-[2rem] mb-6 shadow-sm">
                <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[1s]" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[#7C3AED] font-bold text-xs shadow-sm">
                  {place.price}
                </div>
                {isAdmin && <button type="button" onClick={e => {
              e.stopPropagation();
              window.location.href = `/admin/products?edit=${place.id}`;
            }} className="absolute top-4 left-4 bg-white/95 text-purple-700 hover:text-purple-900 font-bold px-3 py-2 rounded-xl text-xs z-20 transition-all shadow border border-slate-100 flex items-center gap-1.5 cursor-pointer">
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                   <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#7C3AED] transition-colors leading-tight">{place.name}</h3>
                   <div className="flex items-center gap-1 text-xs font-bold text-gray-950 bg-gray-50 px-2 py-1 rounded-lg shrink-0">
                      <Star size={12} className="text-yellow-400" fill="currentColor" />
                      <span>{place.rating}</span>
                   </div>
                </div>
                <p className="text-sm font-medium text-gray-400 line-clamp-1">{place.desc}</p>
              </div>
            </motion.div>)}
        </div>
      </section>

      {/* MODAL 1: FLIGHT/TRAIN/BUS RESULTS & INTERACTIVE SEAT SELECTOR */}
      <AnimatePresence>
        {showFlightSearch && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative p-8 md:p-10 space-y-6">
              {/* Reset/Close Button */}
              <button onClick={() => {
            setShowFlightSearch(false);
            setSeatMapStep(false);
            setSelectedTransport(null);
            setChosenSeat('');
          }} className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-650 hover:text-gray-900 rounded-full flex items-center justify-center border border-gray-150 cursor-pointer transition-colors">
                <X size={18} />
              </button>

              {!seatMapStep ? <>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      {activeTab === 'flights' ? cabinClass : activeTab === 'trains' ? 'Sleeper Coach Class' : 'Premium Sleeper Deck'}
                    </span>
                    <h3 className="text-2xl font-black text-gray-900">{origin} ➔ {destination}</h3>
                    <p className="text-xs text-gray-400 font-semibold">Clearance Date: {date} • Live Seat Booking Panel</p>
                  </div>

                  <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
                    {getTransportList().map(fl => <div key={fl.id} className="p-5 bg-gray-50 border border-gray-150 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-300 transition-all shadow-sm hover:shadow-md">
                         <div className="space-y-1">
                           <div className="flex items-center gap-2">
                             {activeTab === 'flights' ? <Plane size={14} className="text-[#7C3AED]" /> : activeTab === 'trains' ? <Train size={14} className="text-[#7C3AED]" /> : <Bus size={14} className="text-[#7C3AED]" />}
                             <span className="text-xs font-black text-purple-650 tracking-wider font-mono">{fl.carrier} ({fl.id})</span>
                           </div>
                           <div className="flex items-center gap-3 pt-1">
                              <span className="text-sm font-black text-gray-900-800">{fl.dep}</span>
                              <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">{fl.duration}</span>
                              <span className="text-sm font-black text-gray-900-800">{fl.arr}</span>
                           </div>
                         </div>
                         <div className="text-right flex md:flex-col items-center justify-between md:justify-end gap-3 shrink-0">
                           <p className="text-lg font-black text-gray-950">₹ {fl.price.toLocaleString('en-IN')}</p>
                           <button onClick={() => handleBookFlight(fl)} className="px-5 py-2.5 bg-[#7C3AED] hover:bg-purple-700 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5">
                             <Armchair size={13} /> Select Seats
                           </button>
                         </div>
                      </div>)}
                  </div>
                </> : (/* INTERACTIVE SEAT MAP LAYOUT */
          <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <button onClick={() => {
                setSeatMapStep(false);
                setChosenSeat('');
              }} className="text-xs font-bold text-gray-500 hover:text-[#7C3AED] flex items-center gap-1 underline">
                      ← Back to Schedules
                    </button>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-3 py-1 rounded-full tracking-wider">
                      Interactive Passenger Cabin
                    </span>
                    <h3 className="text-xl font-black text-gray-900">Choose Your Transport Seat</h3>
                    <p className="text-xs text-gray-400 font-medium">
                      Selecting for <b className="text-gray-700 font-bold">{selectedTransport?.carrier} ({selectedTransport?.id})</b>
                    </p>
                  </div>

                  {/* LEGEND */}
                  <div className="flex items-center justify-center gap-6 py-2 border-y border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 bg-[#7C3AED] rounded-md border border-[#7C3AED]" />
                      <span>Chosen</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 bg-white rounded-md border border-gray-300" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 bg-gray-200 rounded-md border border-gray-250 cursor-not-allowed" />
                      <span>Booked</span>
                    </div>
                  </div>

                  {/* RENDER CABIN ACCORDING TO TRANSPORT CATEGORY */}
                  <div className="py-2">
                    {activeTab === 'flights' && <div className="bg-gray-50 border border-gray-200 rounded-[2.5rem] p-6 max-w-[340px] mx-auto shadow-inner relative overflow-hidden">
                        {/* Fuselage circular top */}
                        <div className="h-10 border-b border-gray-200/50 flex items-center justify-center mb-6">
                          <span className="text-[9px] font-black tracking-[0.3em] text-gray-400 uppercase">▲ FLIGHT CABIN FRONT ▲</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          {[1, 2, 3, 4, 5, 6].map(rowNum => {
                    const letters = ['A', 'B', 'C', 'D'];
                    return <div key={rowNum} className="flex items-center gap-2.5">
                                {letters.slice(0, 2).map(letter => {
                        const sCode = `${rowNum}${letter}`;
                        const isBlock = bookedSeats.includes(sCode);
                        const isSel = chosenSeat === sCode;
                        return <button key={sCode} type="button" disabled={isBlock} onClick={() => setChosenSeat(sCode)} className={cn("w-9 h-9 rounded-xl font-mono text-[11px] font-black transition-all flex items-center justify-center cursor-pointer active:scale-95 border", isBlock ? "bg-gray-200 text-gray-450 border-gray-250 cursor-not-allowed" : isSel ? "bg-[#7C3AED] text-white border-[#7C3AED] scale-105 shadow-md shadow-purple-150" : "bg-white border-gray-250 text-gray-700 hover:border-purple-400 hover:bg-purple-50")}>
                                      {sCode}
                                    </button>;
                      })}

                                {/* AISLE LABEL */}
                                <div className="w-8 flex items-center justify-center text-[10px] font-bold text-gray-300 font-mono">
                                  Row {rowNum}
                                </div>

                                {letters.slice(2, 4).map(letter => {
                        const sCode = `${rowNum}${letter}`;
                        const isBlock = bookedSeats.includes(sCode);
                        const isSel = chosenSeat === sCode;
                        return <button key={sCode} type="button" disabled={isBlock} onClick={() => setChosenSeat(sCode)} className={cn("w-9 h-9 rounded-xl font-mono text-[11px] font-black transition-all flex items-center justify-center cursor-pointer active:scale-95 border", isBlock ? "bg-gray-200 text-gray-450 border-gray-250 cursor-not-allowed" : isSel ? "bg-[#7C3AED] text-white border-[#7C3AED] scale-105 shadow-md shadow-purple-150" : "bg-white border-gray-250 text-gray-700 hover:border-purple-400 hover:bg-purple-50")}>
                                      {sCode}
                                    </button>;
                      })}
                              </div>;
                  })}
                        </div>
                        <div className="text-center mt-6 text-[9px] font-semibold text-gray-400">Emergency exits located behind row 4.</div>
                      </div>}

                    {activeTab === 'trains' && <div className="bg-gray-50 border border-gray-200 rounded-[2.5rem] p-6 max-w-[340px] mx-auto shadow-inner">
                        <div className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                          Sleeper Berths Compartment Layout
                        </div>

                        <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                          {['LB-1', 'MB-2', 'UB-3', 'SL-4', 'SU-5', 'LB-6', 'MB-7', 'UB-8', 'SL-9', 'SU-10', 'LB-11', 'UB-12'].map(berth => {
                    const isBlock = bookedSeats.includes(berth);
                    const isSel = chosenSeat === berth;
                    return <button key={berth} disabled={isBlock} onClick={() => setChosenSeat(berth)} className={cn("h-11 rounded-xl flex items-center justify-between px-3 text-xs font-black font-mono transition-all border", isBlock ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed" : isSel ? "bg-[#7C3AED] text-white border-[#7C3AED] scale-[1.02] shadow-md shadow-purple-150" : "bg-white border-gray-250 text-gray-700 hover:bg-purple-50 hover:border-purple-300")}>
                                <span>{berth}</span>
                                <span className="text-[8px] font-bold opacity-75">
                                  {isBlock ? 'Blocked' : isSel ? 'Selected' : 'Sleeper'}
                                </span>
                              </button>;
                  })}
                        </div>
                      </div>}

                    {activeTab === 'buses' && <div className="bg-gray-50 border border-gray-200 rounded-[2.5rem] p-6 max-w-[340px] mx-auto shadow-inner">
                        <div className="flex justify-between items-center mb-5 border-b border-gray-150 pb-2.5">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bus Sleeper Deck</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            Front Driver Wheel
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {['W-1', 'A-1', 'W-2', 'A-2', 'W-3', 'A-3', 'W-4', 'A-4', 'W-5', 'A-5', 'W-6', 'A-6'].map(bCode => {
                    const isBlock = bookedSeats.includes(bCode);
                    const isSel = chosenSeat === bCode;
                    return <button key={bCode} disabled={isBlock} onClick={() => setChosenSeat(bCode)} className={cn("h-11 rounded-xl flex items-center justify-between px-3 text-xs font-black font-mono transition-all border", isBlock ? "bg-gray-200 text-gray-400 border-gray-250 cursor-not-allowed" : isSel ? "bg-[#7C3AED] text-white border-[#7C3AED] scale-[1.02] shadow-md shadow-purple-150" : "bg-white border-gray-250 text-gray-700 hover:bg-purple-50 hover:border-purple-300")}>
                                <span>{bCode}</span>
                                <span className="text-[8px] font-bold opacity-75">
                                  {isBlock ? 'Occupied' : isSel ? 'Chosen' : bCode.startsWith('W') ? 'Window' : 'Aisle'}
                                </span>
                              </button>;
                  })}
                        </div>
                      </div>}
                  </div>

                  {/* BOTTOM BOOKING CONFIRM BAR */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Selected Passenger Seat</p>
                      <p className="text-lg font-black text-gray-900">
                        {chosenSeat ? `Seat/Berth ${chosenSeat}` : 'Choose an active seat'}
                      </p>
                      {chosenSeat && <p className="text-[10px] text-purple-600 font-bold">
                          ✓ Complimentary seat upgrade matching {cabinClass} inclusion.
                        </p>}
                    </div>
                    
                    <button onClick={handleConfirmSeatBooking} disabled={!chosenSeat} className="w-full md:w-auto px-6 h-12 bg-purple-650 hover:bg-purple-700 disabled:bg-purple-200 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all transform active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer">
                      <ShieldCheck size={16} /> Confirm Seat & Checkout
                    </button>
                  </div>
                </div>)}
            </motion.div>
          </div>}
      </AnimatePresence>

      {/* MODAL 2: LANDMARK HOLIDAY PACKAGE CONFIRM DRAWER */}
      <AnimatePresence>
        {selectedDestination && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
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
              <button onClick={() => setSelectedDestination(null)} className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-[#7C3AED] rounded-full flex items-center justify-center border border-gray-100 cursor-pointer">
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full">Holiday Package</span>
                <h3 className="text-xl font-bold text-gray-900">{selectedDestination.name}</h3>
              </div>

              <div className="h-44 rounded-3xl overflow-hidden shadow-inner">
                <img src={selectedDestination.image} alt={selectedDestination.name} className="w-full h-full object-cover" />
              </div>

              <p className="text-xs text-gray-500 leading-relaxed font-semibold">{selectedDestination.desc}. Includes 5-star hotel logistics and airport business lounge check-ins.</p>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs font-bold leading-none">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Package Settle</p>
                  <p className="text-lg font-black text-gray-900">{selectedDestination.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Affordable Balance</p>
                  <p className="text-xs text-[#7C3AED]">₹ {balance.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <button onClick={() => handleBookPackage(selectedDestination)} className="w-full h-14 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                Confirm Holiday Settle ({selectedDestination.price})
              </button>
            </motion.div>
          </div>}
      </AnimatePresence>

      {isAdmin && <button onClick={() => window.location.href = '/admin/products?openAdd=true'} className="fixed bottom-24 right-8 bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-xl shadow-purple-600/20 flex items-center gap-2 transition-all z-40 hover:scale-105 cursor-pointer">
          <Plus size={16} />
          <span>+ Add Route</span>
        </button>}
    </div>;
}