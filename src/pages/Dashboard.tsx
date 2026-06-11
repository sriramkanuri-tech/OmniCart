import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Plane, Utensils, CreditCard, 
  Smartphone, ReceiptText, Gift, Grid2X2,
  Search, Bell, ChevronRight, Star, 
  Clock, MapPin, Send, QrCode, 
  History, Plus, ArrowRight, ShieldCheck,
  Navigation, Hotel, Train, Bus, Headphones,
  User, Settings, LogOut, TrendingUp, X, CheckCircle2, Ticket
} from 'lucide-react';
import { Button } from '@/src/components/ui/Inputs';
import { cn } from '@/src/lib/utils';
import { useGlobalState } from '@/src/hooks/useGlobalState';

export default function Dashboard() {
  const navigate = useNavigate();
  const { balance, profile, transactions, updateBalance, addTransaction } = useGlobalState();

  // Active states
  const [travelTab, setTravelTab] = useState<'flights' | 'hotels' | 'trains' | 'bus'>('flights');
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<any | null>(null);
  const [flightResults, setFlightResults] = useState<boolean>(false);
  
  // App Notification alerts
  const [alert, setAlert] = useState<{ show: boolean, msg: string, success: boolean }>({
    show: false,
    msg: '',
    success: true
  });

  const showAlert = (msg: string, success: boolean = true) => {
    setAlert({ show: true, msg, success });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  const handleQuickBuy = (item: any) => {
    const rawPrice = parseInt(item.price.replace(/[^\d]/g, ''));
    if (balance < rawPrice) {
      showAlert('Purchase failed: Insufficient wallet balance!', false);
      setCheckoutItem(null);
      return;
    }

    const newBalance = balance - rawPrice;
    updateBalance(newBalance);
    addTransaction({
      title: item.name,
      subtitle: `Purchase • Just now`,
      amount: rawPrice,
      type: 'out',
      status: 'Success'
    });

    setCheckoutItem(null);
    showAlert(`Successfully purchased ${item.name}! Ledger recorded.`);
  };

  const handleFlightBook = (flight: any) => {
    if (balance < flight.price) {
      showAlert('Booking failed: Insufficient wallet balance!', false);
      return;
    }

    const newBalance = balance - flight.price;
    updateBalance(newBalance);
    addTransaction({
      title: `${flight.carrier} Flight Booking`,
      subtitle: `BOM ➔ DEL • Just now`,
      amount: flight.price,
      type: 'out',
      status: 'Success'
    });

    setFlightResults(false);
    showAlert(`Successfully booked flight ${flight.id}! Ticket details dispatched.`);
  };

  return (
    <div className="space-y-8 pb-12 font-sans text-gray-900 relative">
      {/* Toast Alert */}
      <AnimatePresence>
        {alert.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={cn(
              "fixed top-24 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl font-bold text-sm text-white",
              alert.success ? "bg-emerald-600" : "bg-red-600"
            )}
          >
            {alert.success ? <CheckCircle2 size={18} /> : <X size={18} className="bg-red-700 rounded-full p-0.5" />}
            <span>{alert.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Welcome Section */}
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Hi, {profile.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 font-medium">What service would you like to settle today?</p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Main Context) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Mini Wallet Widget */}
          <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-[2.5rem] p-8 text-white shadow-xl shadow-purple-200">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <p className="text-xs opacity-70 font-semibold">Wallet Balance</p>
                <p className="text-3xl font-bold">₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
              <button 
                onClick={() => navigate('/wallet')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-4 py-2 text-[10px] font-bold flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus size={14} /> Add Money
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <WalletAction icon={Send} label="Send" onClick={() => navigate('/wallet')} />
              <WalletAction icon={QrCode} label="Scan & Pay" onClick={() => navigate('/wallet')} />
              <WalletAction icon={History} label="History" onClick={() => navigate('/wallet')} />
              <WalletAction icon={Plus} label="Request" onClick={() => navigate('/wallet')} />
            </div>
          </div>

          {/* Explore Services */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold">Explore Services</h3>
                <button onClick={() => navigate('/wallet')} className="text-[10px] font-bold text-[#7C3AED]">View All</button>
             </div>
             <div className="grid grid-cols-4 gap-6">
                <ServiceIcon icon={ShoppingBag} label="Shopping" sub="Best Deals" color="bg-pink-50 text-pink-500" onClick={() => navigate('/shopping')} />
                <ServiceIcon icon={Plane} label="Travel" sub="Book Tickets" color="bg-blue-50 text-blue-500" onClick={() => navigate('/travel')} />
                <ServiceIcon icon={Utensils} label="Food" sub="Order Now" color="bg-orange-50 text-orange-500" onClick={() => navigate('/food')} />
                <ServiceIcon icon={CreditCard} label="Payments" sub="Pay & Transfer" color="bg-indigo-50 text-indigo-500" onClick={() => navigate('/wallet')} />
                <ServiceIcon icon={Smartphone} label="Recharge" sub="Top-up" color="bg-blue-50 text-blue-500" onClick={() => navigate('/bills')} />
                <ServiceIcon icon={ReceiptText} label="Bills" sub="Pay Bills" color="bg-green-50 text-green-500" onClick={() => navigate('/bills')} />
                <ServiceIcon icon={Gift} label="Rewards" sub="Vouchers" color="bg-pink-50 text-pink-500" onClick={() => navigate('/rewards')} />
                <ServiceIcon icon={Grid2X2} label="Settings" sub="Set Limits" color="bg-gray-50 text-gray-400" onClick={() => navigate('/settings')} />
             </div>
          </div>

          {/* Special Offer Banner */}
          <div className="relative bg-[#FFF5F1] rounded-[2.5rem] p-8 overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <span className="text-[10px] font-bold text-[#FF6B35]">Special Offer 🔥</span>
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">Get up to 20% cashback <br /> <span className="text-gray-500 font-medium text-sm">on all shopping checkout</span></h3>
              <button onClick={() => navigate('/shopping')} className="bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-purple-100 cursor-pointer hover:bg-purple-700 transition-colors">Explore Now</button>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1629131726692-1accd1143ce0?q=80&w=200&auto=format&fit=crop" 
              className="absolute right-[-20px] bottom-[-20px] w-48 opacity-40 group-hover:scale-110 transition-transform duration-700"
              alt="shopping"
            />
          </div>

          {/* Top Deals */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
               <h3 className="text-sm font-bold">Top Deals for You</h3>
               <button onClick={() => navigate('/shopping')} className="text-[10px] font-bold text-[#7C3AED]">View All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              <div onClick={() => setCheckoutItem({ name: 'boAt Rockerz Headphones', price: '₹1,499', original: '₹2,499', discount: '40% OFF', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop' })}>
                <DealCard 
                  image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=420&auto=format&fit=crop" 
                  name="boAt Headphones"
                  price="₹1,499"
                  original="₹2,499"
                  discount="40% OFF"
                />
              </div>
              <div onClick={() => setCheckoutItem({ name: 'Nike Air Max Running', price: '₹3,299', original: '₹5,999', discount: '45% OFF', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop' })}>
                <DealCard 
                  image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop" 
                  name="Nike Air Max"
                  price="₹3,299"
                  original="₹5,999"
                  discount="45% OFF"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column (Wallet & Food) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Wallet Widget Detailed */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8 text-[#1a1a1a]">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">Wallet Fast Pay</h3>
              <button onClick={() => navigate('/wallet')} className="text-gray-400 hover:text-purple-600 transition-colors cursor-pointer"><Plus size={20} /></button>
            </div>
            
            <div className="bg-[#5B21B6] rounded-3xl p-6 text-white relative overflow-hidden">
               <div className="relative z-10 flex flex-col gap-1">
                 <p className="text-[10px] opacity-70 font-semibold">Total Balance</p>
                 <h4 className="text-2xl font-bold">₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h4>
                 <div className="mt-4 flex items-center gap-2 text-[10px] font-bold">
                    <Navigation size={12} className="rotate-45" />
                    <span>UPI: {profile.email.split('@')[0]}@omnicart</span>
                 </div>
               </div>
               <div className="absolute right-6 top-6 opacity-20"><CreditCard size={48} /></div>
            </div>

            <div className="grid grid-cols-4 gap-4">
               {[
                 { icon: Plus, label: 'Add' },
                 { icon: Send, label: 'Send' },
                 { icon: QrCode, label: 'Scan' },
                 { icon: History, label: 'History' }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => navigate('/wallet')}
                      className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#7C3AED] transition-colors cursor-pointer"
                    >
                       <item.icon size={18} />
                    </button>
                    <span className="text-[9px] font-bold text-gray-400">{item.label}</span>
                 </div>
               ))}
            </div>

            {/* Recent Transactions list */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold">Recent Transactions</h4>
                  <button onClick={() => navigate('/wallet')} className="text-[10px] font-bold text-[#7C3AED] hover:underline">View All</button>
               </div>
               <div className="space-y-3">
                 {transactions.slice(0, 4).map((tx, idx) => (
                   <div 
                     key={tx.id || idx} 
                     onClick={() => setSelectedTx(tx)}
                     title="Click to view digital receipt"
                   >
                     <TransactionRow 
                       icon={tx.type === 'in' ? '+' : '↓'} 
                       name={tx.title} 
                       date={tx.subtitle} 
                       amount={`${tx.type === 'in' ? '+' : '-'} ₹${tx.amount.toLocaleString('en-IN')}`} 
                       color={tx.type === 'in' ? "bg-green-150" : "bg-purple-50"} 
                       text={tx.type === 'in' ? "green-600" : "purple-600"} 
                     />
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Food Delivery Widget */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">Food Delivery</h3>
              <button onClick={() => navigate('/food')} className="text-gray-400 hover:text-purple-600 transition-colors"><Plus size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer hover:text-[#7C3AED] transition-colors" onClick={() => navigate('/settings')}>
                <MapPin size={16} className="text-red-500" />
                <span>Koramangala, Bangalore</span>
                <ChevronRight size={14} className="rotate-90 ml-auto animate-pulse" />
              </div>

              <div className="relative" onClick={() => navigate('/food')}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 text-sm focus:ring-1 focus:ring-purple-200 cursor-pointer" 
                  placeholder="Search for restaurants or dishes..." 
                  readOnly
                />
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                {['All', 'Pure Veg', 'Biryani', 'Pizza', 'Burger'].map((cat, i) => (
                  <button onClick={() => navigate('/food')} key={i} className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer hover:scale-105 transition-all",
                    i === 0 ? "bg-[#7C3AED] text-white" : "bg-gray-50 text-gray-500"
                  )}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Fast food cards with click buy triggering checkout */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-gray-800">Fast Delivery Options</h4>
                <div onClick={() => setCheckoutItem({ name: 'Burger King Royal Box', price: '₹450', original: '₹750', discount: 'Free Delivery', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' })}>
                  <RestaurantCard 
                    image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop" 
                    name="Burger King"
                    meta="30-35 min • 4.3 ★"
                    status="Free Delivery"
                  />
                </div>
                <div onClick={() => setCheckoutItem({ name: 'Pizza Hut Supreme Feast', price: '₹599', original: '₹999', discount: '₹40 OFF', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop' })}>
                  <RestaurantCard 
                    image="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop" 
                    name="Pizza Hut"
                    meta="25-30 min • 4.2 ★"
                    status="₹40 OFF above ₹299"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Travel & History) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Travel Booking */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">Travel Booking</h3>
              <button onClick={() => navigate('/travel')} className="text-gray-400 hover:text-purple-600 transition-colors"><Plus size={20} /></button>
            </div>

            <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
               <TravelTab icon={Plane} label="Flights" active={travelTab === 'flights'} onClick={() => setTravelTab('flights')} />
               <TravelTab icon={Hotel} label="Hotels" active={travelTab === 'hotels'} onClick={() => setTravelTab('hotels')} />
               <TravelTab icon={Train} label="Trains" active={travelTab === 'trains'} onClick={() => setTravelTab('trains')} />
               <TravelTab icon={Bus} label="Bus" active={travelTab === 'bus'} onClick={() => setTravelTab('bus')} />
            </div>

            <div className="space-y-4">
               <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">From Departure Station</p>
                     <p className="text-sm font-bold text-gray-800">Mumbai (BOM)</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl relative">
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Destination Station</p>
                     <p className="text-sm font-bold text-gray-800">Delhi (DEL)</p>
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-100"><History size={14} className="rotate-90" /></div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Date</p>
                     <p className="text-sm font-bold text-gray-800">25 May 2026</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Passengers</p>
                     <p className="text-sm font-bold text-gray-800">1 Passenger</p>
                  </div>
               </div>
               <Button 
                 onClick={() => setFlightResults(true)} 
                 className="w-full h-14 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm tracking-wide cursor-pointer transition-colors"
               >
                 Search flights
               </Button>
            </div>

            <div className="relative h-24 bg-blue-50 rounded-[2rem] overflow-hidden p-4 flex items-center gap-4">
               <div className="relative z-10 flex-1">
                  <p className="text-[10px] font-bold text-blue-800">Flat 10% OFF</p>
                  <p className="text-xs font-medium text-blue-900/60">On SBI & HDFC Cards</p>
               </div>
               <Plane className="absolute right-4 text-blue-200/50" size={64} />
            </div>
          </div>

          {/* Cross-Service History */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">Recent Receipts</h3>
              <button onClick={() => navigate('/wallet')} className="text-gray-400"><Plus size={20} /></button>
            </div>

            <div className="space-y-4">
               <div onClick={() => setSelectedTx({ title: 'Amazon Shopping Store', amount: 1499, subtitle: 'Shopping • Yesterday', status: 'Success' })}>
                 <HistoryRow icon={<ShoppingBag size={14} />} name="Amazon Shopping" meta="Order #123456" date="Yesterday" amount="1,499" />
               </div>
               <div onClick={() => setSelectedTx({ title: 'Uber Transport Services', amount: 350, subtitle: 'Journey • 1 day ago', status: 'Success' })}>
                 <HistoryRow icon="U" name="Uber Ride" meta="Trip to Airport" date="1 day ago" amount="350" />
               </div>
               <div onClick={() => setSelectedTx({ title: 'Swiggy Eat-out Delivery', amount: 280, subtitle: 'Fast Food • 2 days ago', status: 'Success' })}>
                 <HistoryRow icon="S" name="Swiggy Order" meta="Order #98765" date="2 days ago" amount="280" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Rewards */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">Rewards Rewards Center</h3>
              <button onClick={() => navigate('/rewards')} className="text-gray-400"><Plus size={20} /></button>
           </div>
           <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] opacity-70">Gold Points</p>
                <h4 className="text-2xl font-bold">₹ 1,250</h4>
                <p className="text-[10px] font-bold mt-1 opacity-80">Available Cash rewards</p>
              </div>
              <Gift className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" size={48} />
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold">
                 <span>Promo Codes Available</span>
                 <button onClick={() => navigate('/rewards')} className="text-[#7C3AED]">View All</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#7C3AED]"><Gift size={16} /></div>
                    <div>
                      <p className="text-[9px] font-bold">Cashback Voucher</p>
                      <p className="text-[8px] text-gray-400">Valid till 30 June</p>
                    </div>
                 </div>
                 <span className="text-[10px] font-bold text-[#7C3AED]">₹150</span>
              </div>
           </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">System Broadcasts</h3>
              <button className="text-gray-400"><Plus size={20} /></button>
           </div>
           <div className="space-y-4">
              <NotificationItem icon={<ShoppingBag size={14} />} title="Order Dispatched" desc="Your order #123456 has been sorted" time="Now" color="bg-green-50 text-green-500" />
              <NotificationItem icon={<Plane size={14} />} title="Direct Flight confirmed" desc="Your ticket BOM to DEL layout is saved" time="30m ago" color="bg-blue-50 text-blue-500" />
              <NotificationItem icon={<CreditCard size={14} />} title="Wallet Connected" desc="Encrypted bank connection verified" time="1h ago" color="bg-orange-50 text-orange-500" />
           </div>
        </div>

        {/* Profile Card links */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">My ID</h3>
              <button onClick={() => navigate('/settings')} className="text-gray-400"><Plus size={20} /></button>
           </div>
           <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
                <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{profile.name}</p>
                <p className="text-[10px] text-gray-400 font-medium">{profile.email}</p>
              </div>
           </div>
           <div className="space-y-1">
              <div onClick={() => navigate('/settings')}><ProfileLink icon={User} label="Personal Information" /></div>
              <div onClick={() => navigate('/settings')}><ProfileLink icon={MapPin} label="Delivery Addresses" /></div>
              <div onClick={() => navigate('/settings')}><ProfileLink icon={Settings} label="System Settings" /></div>
              <div onClick={() => navigate('/')}><ProfileLink icon={LogOut} label="Log Out of Session" /></div>
           </div>
        </div>

        {/* Admin Dashboard (Dark Theme Widget) */}
        <div className="bg-[#0A0A0B] rounded-[2.5rem] shadow-xl p-8 space-y-6 overflow-hidden relative">
           <div className="flex justify-between items-center relative z-10">
              <h3 className="text-sm font-bold text-white font-mono">ADMIN SERVICES</h3>
              <button className="text-gray-600"><Plus size={20} /></button>
           </div>
           <div className="grid grid-cols-2 gap-4 relative z-10">
              <AdminStat label="Total Volume" value="₹ 4.54 Cr" trend="+ 12.5%" color="emerald" />
              <AdminStat label="Platform Uptime" value="100.0%" status="Operational" color="emerald" />
           </div>
           <div className="space-y-2 pt-4 relative z-10">
              <div onClick={() => navigate('/settings')} className="flex justify-between items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg">
                 <AdminLink icon={Settings} label="Access Console" />
                 <ChevronRight size={14} className="text-gray-600" />
              </div>
           </div>
           <div className="absolute opacity-10 -right-10 -bottom-10 pointer-events-none">
              <TrendingUp size={240} className="text-[#7C3AED]" />
           </div>
        </div>
      </div>

      {/* Footer Features Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-12 border-t border-gray-100">
         <FeatureItem icon={CreditCard} label="Unified Wallet" sub="Instant settlements" />
         <FeatureItem icon={ShieldCheck} label="Military AES Guard" sub="100% secure payments" />
         <FeatureItem icon={Bell} label="Broadcast updates" sub="Real-time notifications" />
         <FeatureItem icon={Headphones} label="24/7 Concierge" sub="Premium support chat" />
      </div>

      {/* MODAL 1: Clickable Invoice Digital Receipt */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative space-y-6 border border-gray-100 shadow-2xl"
            >
              <button onClick={() => setSelectedTx(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 cursor-pointer">
                <X size={20} />
              </button>
              
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-purple-50 text-[#7C3AED] rounded-full flex items-center justify-center mx-auto">
                  <ReceiptText size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">OmniCart Invoice</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-black">Success Receipt</p>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Recipient Merchant:</span>
                  <span className="text-gray-800 font-bold text-right">{selectedTx.title}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Date & Time:</span>
                  <span className="text-gray-800">{selectedTx.date || 'Just now'}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Reference Token:</span>
                  <span className="text-gray-800 font-mono">TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Settlement Code:</span>
                  <span className="text-green-600 font-bold uppercase">UPI_SETTLED_AES</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">Invoice Total</span>
                <span className="text-lg font-black text-gray-900">{selectedTx.amount ? selectedTx.amount : JSON.stringify(selectedTx.amount)}</span>
              </div>

              <button 
                onClick={() => {
                  setSelectedTx(null);
                  showAlert("Receipt PDF dispatched to your registered email!");
                }}
                className="w-full py-3 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-transform cursor-pointer text-center"
              >
                Dispatched PDF Receipt
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Dynamic Checkout Modal */}
      <AnimatePresence>
        {checkoutItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full relative space-y-6 border border-gray-100 shadow-2xl"
            >
              <button onClick={() => setCheckoutItem(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 cursor-pointer">
                <X size={20} />
              </button>
              
              <div className="space-y-2">
                <span className="text-[10px] font-black text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider">Fast Checkout</span>
                <h3 className="text-xl font-bold text-gray-900">Confirm Order Settlement</h3>
              </div>

              <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                <img src={checkoutItem.image} className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-sm" alt="product" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-800 leading-tight">{checkoutItem.name}</h4>
                  <p className="text-xs text-green-500 font-bold">{checkoutItem.discount}</p>
                  <p className="text-md font-black text-gray-900">{checkoutItem.price}</p>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-bold">Deliver To Address:</span>
                  <span className="text-xs text-gray-800 font-bold">Koramangala Block 4, Bangalore</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-bold">Settlement Method:</span>
                  <span className="text-xs text-[#7C3AED] font-bold">OmniCart Wallet Balance</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-bold">Current Wallet Balance:</span>
                  <span className="text-xs text-gray-800 font-bold">₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button 
                onClick={() => handleQuickBuy(checkoutItem)}
                className="w-full h-14 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-purple-100 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} /> Purchase via Fast Pay
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Travel Flight Options Search Results */}
      <AnimatePresence>
        {flightResults && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-xl w-full relative space-y-6 border border-gray-100 shadow-2xl overflow-hidden"
            >
              <button onClick={() => setFlightResults(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 cursor-pointer">
                <X size={20} />
              </button>
              
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">Available Flights</span>
                <h3 className="text-xl font-bold text-gray-900">BOM ➔ DEL (25 May 2026)</h3>
                <p className="text-xs text-gray-400">Pay using your OmniCart balances for immediate cashback settlements.</p>
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto no-scrollbar pr-1">
                {[
                  { id: 'AI-204', carrier: 'Air India', dep: '08:00 AM', arr: '10:15 AM', price: 4200, time: '2h 15m' },
                  { id: '6E-501', carrier: 'Indigo', dep: '11:45 AM', arr: '02:00 PM', price: 3450, time: '2h 15m' },
                  { id: 'QP-771', carrier: 'Akasa Air', dep: '04:30 PM', arr: '06:50 PM', price: 3100, time: '2h 20m' }
                ].map((fl) => (
                  <div key={fl.id} className="p-5 border border-gray-100 bg-gray-50 rounded-2xl flex items-center justify-between hover:border-purple-200 transition-all">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{fl.carrier} ({fl.id})</span>
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-sm font-black text-gray-800">{fl.dep}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">• {fl.time} •</span>
                        <span className="text-sm font-black text-gray-800">{fl.arr}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-md font-black text-[#7C3AED]">₹ {fl.price.toLocaleString('en-IN')}</p>
                      <button 
                        onClick={() => handleFlightBook(fl)}
                        className="mt-1.5 px-4 py-2 bg-gray-900 hover:bg-[#7C3AED] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WalletAction({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick}>
      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-all">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-white/80">{label}</span>
    </div>
  );
}

function ServiceIcon({ icon: Icon, label, sub, color, onClick }: { icon: any, label: string, sub: string, color: string, onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer text-center" onClick={onClick}>
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", color)}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-800 leading-tight">{label}</p>
        <p className="text-[8px] text-gray-400 whitespace-nowrap">{sub}</p>
      </div>
    </div>
  );
}

function DealCard({ image, name, price, original, discount }: any) {
  return (
    <div className="flex-shrink-0 w-44 bg-white rounded-[2rem] border border-gray-100 p-4 space-y-3 group cursor-pointer hover:shadow-lg transition-all">
      <div className="h-32 rounded-2xl overflow-hidden bg-gray-50">
         <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-gray-800 truncate">{name}</h4>
        <div className="flex items-center gap-2">
           <span className="text-sm font-bold">{price}</span>
           <span className="text-[10px] text-gray-400 line-through">{original}</span>
        </div>
        <div className="text-[9px] font-bold text-green-500">{discount}</div>
      </div>
    </div>
  );
}

function TransactionRow({ icon, name, date, amount, color, text }: any) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0", color, text ? `text-${text}` : 'text-gray-605')}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold truncate text-gray-800">{name}</p>
        <p className="text-[8px] text-gray-400">{date}</p>
      </div>
      <p className="text-[10px] font-bold text-gray-900 shrink-0">{amount}</p>
    </div>
  );
}

function RestaurantCard({ image, name, meta, status }: any) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer p-2 hover:bg-gray-50 rounded-2xl transition-all">
      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0">
         <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-850 truncate">{name}</p>
        <p className="text-[9px] text-gray-400">{meta}</p>
        <p className="text-[9px] font-bold text-emerald-500 mt-0.5">{status}</p>
      </div>
    </div>
  );
}

function TravelTab({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all cursor-pointer",
        active ? "bg-[#7C3AED] text-white shadow-lg shadow-purple-100" : "text-gray-400 hover:text-gray-600"
      )}
    >
      <Icon size={14} />
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function HistoryRow({ icon, name, meta, date, amount }: any) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer select-none">
       <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#7C3AED] text-sm font-bold shrink-0">
          {icon}
       </div>
       <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-800 truncate">{name}</p>
          <p className="text-[8px] text-gray-400 truncate">{meta}</p>
          <p className="text-[8px] text-gray-400">{date}</p>
       </div>
       <p className="text-xs font-bold text-gray-900 shrink-0">₹{amount}</p>
    </div>
  );
}

function FeatureItem({ icon: Icon, label, sub }: any) {
  return (
    <div className="flex items-center gap-3 p-6 bg-white rounded-3xl border border-gray-100">
       <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
          <Icon size={20} />
       </div>
       <div>
          <p className="text-xs font-bold text-gray-900 leading-tight">{label}</p>
          <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
       </div>
    </div>
  );
}

function NotificationItem({ icon, title, desc, time, color }: any) {
  return (
    <div className="flex gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer">
       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}>
          {icon}
       </div>
       <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
             <p className="text-[10px] font-bold text-gray-900 truncate">{title}</p>
             <span className="text-[8px] text-gray-400 font-bold whitespace-nowrap ml-2">{time}</span>
          </div>
          <p className="text-[9px] text-gray-500 line-clamp-1">{desc}</p>
       </div>
    </div>
  );
}

function ProfileLink({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group">
       <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#7C3AED] group-hover:bg-purple-50 transition-all">
             <Icon size={16} />
          </div>
          <span className="text-[10px] font-bold text-gray-600 group-hover:text-gray-900">{label}</span>
       </div>
       <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400" />
    </div>
  );
}

function AdminStat({ label, value, trend, status, color }: any) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
       <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
       <p className="text-sm font-bold text-white leading-none">{value}</p>
       {trend && <p className={cn("text-[8px] font-bold mt-1.5", `text-${color}-500`)}>{trend}</p>}
       {status && <p className={cn("text-[8px] font-bold mt-1.5", `text-${color}-500`)}>{status}</p>}
    </div>
  );
}

function AdminLink({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center gap-3 text-white/60 hover:text-white transition-colors cursor-pointer">
       <Icon size={14} />
       <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
}
