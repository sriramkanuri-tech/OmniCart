import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Heart, Star, Grid2X2, SlidersHorizontal, X, CheckCircle2, Plus, Edit2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/src/components/ui/Inputs';
import { cn } from '@/src/lib/utils';
import { useGlobalState } from '@/src/hooks/useGlobalState';
import UroPayButton from '@/src/components/UroPayButton';
const PRODUCTS = [{
  id: 1,
  name: 'Ethereal Timepiece',
  brand: 'Studio V',
  price: '₹ 1,25,000',
  rate: 125000,
  rating: '4.9',
  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
  tag: 'Limited Edition',
  category: 'Watches',
  description: 'Crafted with sapphire crystal and precision micro-oscillations, the Ethereal timepiece is a supreme design icon reflecting sheer luxury.'
}, {
  id: 2,
  name: 'Monolith Headphones',
  brand: 'Audio Arch',
  price: '₹ 45,000',
  rate: 45000,
  rating: '4.8',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
  tag: 'Trending',
  category: 'Audio',
  description: 'Boasting custom-built 40mm transducers and acoustic chamber isolation, Monolith redefines audio clarity.'
}, {
  id: 3,
  name: 'Bespoke Fragrance',
  brand: 'Essence 01',
  price: '₹ 12,500',
  rate: 12500,
  rating: '4.7',
  image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop',
  category: 'Beauty',
  description: 'An immersive fragrance composed of cedarwood extracts, clean sea-salt, and hints of organic garden sage.'
}, {
  id: 4,
  name: 'Arch Chair',
  brand: 'Bauhaus Modern',
  price: '₹ 85,000',
  rate: 85000,
  rating: '5.0',
  image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600&auto=format&fit=crop',
  tag: 'Exclusive',
  category: 'Furniture',
  description: 'Engineered from raw brushed stainless steel and supple tan leather, supporting anatomic spinal posture.'
}];
export default function Shopping() {
  const {
    balance,
    addresses,
    addAddress,
    updateBalance,
    addTransaction,
    addOrder,
    profile
  } = useGlobalState();
  const [productsList, setProductsList] = useState(PRODUCTS);
  const isAdmin = profile?.email === "sriramkanuri4@gmail.com";
  useEffect(() => {
    const fetchStorefrontData = async () => {
      try {
        const res = await axios.get('/api/admin/products', {
          headers: {
            'x-admin-email': 'sriramkanuri4@gmail.com'
          }
        });
        if (res.data && res.data.length > 0) {
          const shoppingItems = res.data.filter(p => p.category === 'Watches' || p.category === 'Audio' || p.category === 'Beauty' || p.category === 'Furniture' || p.category === 'Shopping');
          if (shoppingItems.length > 0) {
            setProductsList(shoppingItems);
          }
        }
      } catch (err) {
        console.error('Error fetching storefront:', err);
      }
    };
    fetchStorefrontData();
  }, []);
  const [selectedCat, setSelectedCat] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive hooks
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [success, setSuccess] = useState(true);

  // Address helper state hooks
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAdrName, setNewAdrName] = useState('Aarav Sharma');
  const [newAdrStreet, setNewAdrStreet] = useState('');
  const [newAdrCity, setNewAdrCity] = useState('');
  const [newAdrZip, setNewAdrZip] = useState('');
  const triggerToast = (msg, isSuccess = true) => {
    setToastMsg(msg);
    setSuccess(isSuccess);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  const handleCheckout = product => {
    if (balance < product.rate) {
      triggerToast('Refused: Insufficient funds in OmniCart balance!', false);
      setSelectedProduct(null);
      return;
    }
    const chosenAddress = addresses.find(adr => adr.id === selectedAddressId) || addresses[0];
    const addressLabel = chosenAddress ? `Delivering to: ${chosenAddress.street}, ${chosenAddress.city}` : "Ground Shipping";
    const newBalance = balance - product.rate;
    updateBalance(newBalance);
    addTransaction({
      title: product.name,
      subtitle: `Store: ${product.brand} • Just now`,
      amount: product.rate,
      type: 'out',
      status: 'Success'
    });
    addOrder({
      title: product.name,
      subtitle: addressLabel,
      amount: product.rate,
      status: 'Confirmed',
      type: 'shopping',
      image: product.image
    });
    triggerToast(`Purchased successfully! Paid ₹${product.rate.toLocaleString('en-IN')} via Wallet.`);
    setSelectedProduct(null);
  };
  const filteredProducts = productsList.filter(p => {
    const matchesCat = selectedCat === 'All Items' || p.category === selectedCat;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });
  return <div className="space-y-12 pb-12 font-sans relative">
      {/* Toast Alert */}
      <AnimatePresence>
        {showToast && <motion.div initial={{
        opacity: 0,
        y: -50
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -50
      }} className={cn("fixed top-24 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl font-bold text-sm text-white", success ? "bg-emerald-600" : "bg-red-600")}>
            {success ? <CheckCircle2 size={18} /> : <X size={18} className="bg-red-700 rounded-full p-0.5" />}
            <span>{toastMsg}</span>
          </motion.div>}
      </AnimatePresence>

      {/* Header & Search */}
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Shopping Store</h1>
            <p className="text-gray-500 font-medium text-lg">Curated premium products. Purchased instantly with your digital wallet.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => triggerToast('Search filtering parameters updated!')} className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#7C3AED] transition-colors cursor-pointer">
               <Grid2X2 size={20} />
             </button>
             <button onClick={() => triggerToast('Parameters sorted based on review indexes!')} className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#7C3AED] transition-colors cursor-pointer">
               <SlidersHorizontal size={20} />
             </button>
          </div>
        </div>

        <div className="relative group max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" size={20} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white border border-gray-100 rounded-[2rem] py-5 pl-16 pr-8 outline-none text-gray-900 font-medium text-lg focus:ring-4 focus:ring-purple-50 shadow-sm transition-all placeholder:text-gray-300" placeholder="Search for premium products..." />
        </div>
      </div>

      {/* Featured Banner */}
      <section className="relative h-[350px] rounded-[3rem] overflow-hidden group shadow-xl">
         <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop" alt="Hero" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
         <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
         <div className="relative z-10 h-full p-16 flex flex-col justify-center text-white space-y-6">
            <div className="flex items-center gap-3">
               <span className="w-8 h-[2px] bg-white opacity-50" />
               <span className="text-xs font-bold uppercase tracking-widest opacity-80 animate-pulse">New Collection 2026</span>
            </div>
            <h2 className="text-5xl font-bold leading-tight">The Modern <br /> Home Essential.</h2>
            <Button onClick={() => setSelectedProduct(PRODUCTS[3])} className="w-fit h-14 px-8 rounded-2xl bg-white text-gray-900 hover:bg-gray-100 font-bold cursor-pointer transition-all">
              Shop Selection
            </Button>
         </div>
      </section>

      {/* Categories Scroller */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {['All Items', 'Watches', 'Audio', 'Beauty', 'Furniture'].map((cat, i) => <button key={i} onClick={() => setSelectedCat(cat)} className={cn("px-8 py-3.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer", selectedCat === cat ? "bg-gray-900 text-white shadow-lg" : "bg-white text-gray-500 border border-gray-100 hover:border-gray-200")}>
            {cat}
          </button>)}
      </div>

      {/* Product List */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-900">Featured Premium Inventory</h3>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing {filteredProducts.length} items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => <motion.div key={product.id} whileHover={{
          y: -6
        }} onClick={() => setSelectedProduct(product)} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full">
              <div className="h-64 relative rounded-[2rem] overflow-hidden mb-6 shadow-sm">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                <button type="button" onClick={e => {
              e.stopPropagation();
              triggerToast(`${product.name} pinned to wish list!`);
            }} className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-red-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                  <Heart size={18} />
                </button>
                
                {isAdmin && <button type="button" onClick={e => {
              e.stopPropagation();
              window.location.href = `/admin/products?edit=${product.id}`;
            }} className="absolute top-4 left-4 bg-white/95 text-purple-700 hover:text-purple-900 font-bold px-3 py-2 rounded-xl text-xs z-20 transition-all shadow border border-slate-100 flex items-center gap-1.5 cursor-pointer">
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>}

                {product.tag && <div className="absolute bottom-4 left-4 px-4 py-2 bg-gray-900/80 backdrop-blur text-white font-bold text-[10px] uppercase tracking-widest rounded-lg">
                    {product.tag}
                  </div>}
              </div>
              
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
                  <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#7C3AED] transition-colors leading-tight">{product.name}</h4>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg w-fit mt-2">
                    <Star size={12} className="text-yellow-400 animate-pulse" fill="currentColor" />
                    <span>{product.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4 shrink-0">
                   <p className="text-xl font-bold text-gray-900">{product.price}</p>
                   <button className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center group-hover:bg-[#7C3AED] group-hover:text-white transition-all transform active:scale-95">
                      <ShoppingBag size={18} />
                   </button>
                </div>
              </div>
            </motion.div>)}
        </div>
      </section>

      {/* Promos */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Current Campaigns & Promos</h3>
          {isAdmin && <button onClick={() => window.location.href = '/admin/offers?openAdd=true'} className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer">
              <Sparkles size={14} />
              <span>+ Add Offer</span>
            </button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div onClick={() => setSelectedProduct(PRODUCTS[1])} className="bg-[#FFF5F1] rounded-[2.5rem] p-10 flex flex-col justify-center gap-6 relative overflow-hidden group cursor-pointer border border-[#FFF5F1]">
            <div className="relative z-10 space-y-4">
               <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em]">Flash Sale</span>
               <h3 className="text-4xl font-bold text-gray-900 leading-tight">Up to 50% <br /> <span className="text-orange-500 italic font-medium">Summer Drops</span></h3>
               <button className="bg-white text-gray-900 px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-100 mt-2 cursor-pointer">Explore Sale</button>
            </div>
            <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300&auto=format&fit=crop" className="absolute right-[-10px] bottom-[-10px] w-48 opacity-20 group-hover:scale-110 transition-transform duration-700" alt="shoe" />
         </div>

         <div onClick={() => triggerToast('Membership details updated! Welcome promo active.')} className="bg-[#F1F4FF] rounded-[2.5rem] p-10 flex flex-col justify-center gap-6 relative overflow-hidden group cursor-pointer border border-blue-100">
            <div className="relative z-10 space-y-4">
               <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Member Perk</span>
               <h3 className="text-4xl font-bold text-gray-900 leading-tight">Free Transport <br /> <span className="text-blue-500 italic font-medium">Worldwide</span></h3>
               <button className="bg-white text-gray-900 px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 mt-2 cursor-pointer">Join Premium</button>
            </div>
            <img src="https://images.unsplash.com/photo-1531303433916-aac21ae4d551?q=80&w=300&auto=format&fit=crop" className="absolute right-[-10px] bottom-[-10px] w-48 opacity-20 group-hover:scale-110 transition-transform duration-700" alt="logistics" />
         </div>
        </div>
      </section>

      {/* Interactive Item Checkout Modal */}
      <AnimatePresence>
        {selectedProduct && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative p-10 space-y-6 border border-gray-100">
              {/* Close Button */}
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer">
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#7C3AED]">{selectedProduct.brand} Exclusive</span>
                <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
              </div>

              <div className="h-44 rounded-2xl overflow-hidden bg-gray-50">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>

              <p className="text-xs text-gray-500 leading-relaxed font-semibold">{selectedProduct.description}</p>

              {/* Delivery Address Identifier Section */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-sans">Shipment Destination Address</label>
                  <button type="button" onClick={() => setShowNewAddressForm(!showNewAddressForm)} className="text-[10px] font-bold text-[#7C3AED] hover:underline">
                    {showNewAddressForm ? 'Select Saved' : '+ New Address'}
                  </button>
                </div>

                {showNewAddressForm ? <div className="space-y-2.5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <input type="text" placeholder="Receiver Name" value={newAdrName} onChange={e => setNewAdrName(e.target.value)} className="w-full h-10 px-3 bg-white border border-gray-150 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#7C3AED]/30" />
                    <input type="text" placeholder="Street Info (e.g. 102 Park Ave)" value={newAdrStreet} onChange={e => setNewAdrStreet(e.target.value)} className="w-full h-10 px-3 bg-white border border-gray-150 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#7C3AED]/30" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="City" value={newAdrCity} onChange={e => setNewAdrCity(e.target.value)} className="w-full h-10 px-3 bg-white border border-gray-150 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#7C3AED]/30" />
                      <input type="text" placeholder="PIN Code" value={newAdrZip} onChange={e => setNewAdrZip(e.target.value)} className="w-full h-10 px-3 bg-white border border-gray-150 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#7C3AED]/30" />
                    </div>
                    <button type="button" onClick={() => {
                if (!newAdrName || !newAdrStreet || !newAdrCity) {
                  triggerToast('Please complete all address fields first.', false);
                  return;
                }
                const newId = `adr-${Date.now()}`;
                addAddress({
                  name: newAdrName,
                  street: newAdrStreet,
                  city: newAdrCity,
                  state: 'Delhi',
                  zip: newAdrZip,
                  phone: '+91 98765 43210'
                });
                setShowNewAddressForm(false);
                setSelectedAddressId(newId);
                triggerToast('Delivery address saved successfully!');
              }} className="w-full h-8 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold uppercase transition">
                      Save Delivery Address
                    </button>
                  </div> : <div>
                    {addresses.length === 0 ? <div className="text-[10px] text-yellow-600 bg-yellow-50 p-3 rounded-xl border border-yellow-100 font-medium">
                        No saved delivery address. Tap "+ New Address" to add.
                      </div> : <select value={selectedAddressId} onChange={e => setSelectedAddressId(e.target.value)} className="w-full h-10 px-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-1 focus:ring-[#7C3AED]/30">
                        <option value="">-- Choose Shipment Address --</option>
                        {addresses.map(adr => <option key={adr.id} value={adr.id}>
                            {adr.name} • {adr.street}, {adr.city}
                          </option>)}
                      </select>}
                  </div>}
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Store price</p>
                  <p className="text-xl font-black text-gray-900">{selectedProduct.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Balance after</p>
                  <p className="text-xs font-bold text-[#7C3AED]">₹ {(balance - selectedProduct.rate).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button type="button" onClick={() => {
              if (addresses.length > 0 && !selectedAddressId && !showNewAddressForm) {
                triggerToast('Please select a shipment delivery address first.', false);
                return;
              }
              handleCheckout(selectedProduct);
            }} className="w-full h-14 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-center cursor-pointer">
                  <ShoppingBag size={18} /> Confirm Purchase ({selectedProduct.price})
                </button>
                <div onClick={e => {
              if (addresses.length > 0 && !selectedAddressId && !showNewAddressForm) {
                e.preventDefault();
                triggerToast('Please select a shipment delivery address first.', false);
              }
            }} className="w-full">
                  <UroPayButton productName={selectedProduct.name} amount={selectedProduct.rate} productId={selectedProduct.id.toString()} />
                </div>
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>

      {isAdmin && <button onClick={() => window.location.href = '/admin/products?openAdd=true'} className="fixed bottom-24 right-8 bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-xl shadow-purple-600/20 flex items-center gap-2 transition-all z-40 hover:scale-105 cursor-pointer">
          <Plus size={16} />
          <span>+ Add Product</span>
        </button>}
    </div>;
}