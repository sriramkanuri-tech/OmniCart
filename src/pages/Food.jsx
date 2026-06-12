import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  MapPin,
  ChevronDown,
  Star,
  Clock,
  Banknote,
  Heart,
  Utensils,
  Filter,
  Grid2X2,
  X,
  CheckCircle2,
  ShoppingBag,
  Plus,
  Edit2
} from "lucide-react";
import axios from "axios";
import { Button } from "@/src/components/ui/Inputs";
import { cn } from "@/src/lib/utils";
import { useGlobalState } from "@/src/hooks/useGlobalState";
const CATEGORIES = ["All", "Pure Veg", "North Indian", "Chinese", "Biryani", "Pizza", "Burgers"];
const RESTAURANTS = [
  {
    id: 1,
    name: "The Burger King",
    rating: "4.3",
    tags: "Burgers, American, Fast Food",
    time: "25-30 min",
    price: "\u20B9 400 for two",
    discount: "60% OFF up to \u20B9120",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
    featuredItem: { name: "Double Whopper Mighty Meal", rate: 350 },
    category: "Burgers"
  },
  {
    id: 2,
    name: "Pizza Hut",
    rating: "4.1",
    tags: "Pizzas, Italian, Desserts",
    time: "30-35 min",
    price: "\u20B9 600 for two",
    discount: "FREE DELIVERY",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop",
    featuredItem: { name: "Supreme Garlic Bread & Personal Pizza Trio", rate: 450 },
    category: "Pizza"
  },
  {
    id: 3,
    name: "Social Eat",
    rating: "4.5",
    tags: "North Indian, Continental",
    time: "40-45 min",
    price: "\u20B9 1200 for two",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=600&auto=format&fit=crop",
    featuredItem: { name: "Butter Chicken & Butter Garlic Naan Platter", rate: 650 },
    category: "North Indian"
  },
  {
    id: 4,
    name: "Biryani Blues",
    rating: "4.4",
    tags: "Biryani, Hyderabadi",
    time: "35-40 min",
    price: "\u20B9 500 for two",
    discount: "BUY 1 GET 1 FREE",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop",
    featuredItem: { name: "Hyderabadi Chicken Biryani Pot", rate: 399 },
    category: "Biryani"
  }
];
export default function Food() {
  const { balance, addresses, addAddress, updateBalance, addTransaction, addOrder, profile } = useGlobalState();
  const isAdmin = profile?.email === "sriramkanuri4@gmail.com";
  const [restaurantsList, setRestaurantsList] = useState(RESTAURANTS);
  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const res = await axios.get("/api/admin/products", {
          headers: { "x-admin-email": "sriramkanuri4@gmail.com" }
        });
        if (res.data && res.data.length > 0) {
          const foodProducts = res.data.filter((p) => p.category === "Food");
          if (foodProducts.length > 0) {
            const customFoodRes = foodProducts.map((p) => ({
              id: p.id,
              name: p.brand || p.name,
              rating: p.rating || "4.5",
              tags: p.name + ", " + (p.description || "Gourmet meal and custom dining option."),
              time: "20-30 min",
              price: `\u20B9 ${p.rate || p.price} for two`,
              discount: p.badge || "PROMO",
              image: p.image,
              featuredItem: { name: p.name, rate: parseFloat(String(p.rate || p.price).replace(/[^0-9.]/g, "")) || 250 },
              category: "Pizza"
            }));
            setRestaurantsList([...RESTAURANTS, ...customFoodRes]);
          }
        }
      } catch (err) {
        console.error("Error fetching foods:", err);
      }
    };
    fetchFoodData();
  }, []);
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRes, setSelectedRes] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [success, setSuccess] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [newAdrName, setNewAdrName] = useState("Aarav Sharma");
  const [newAdrStreet, setNewAdrStreet] = useState("");
  const [newAdrCity, setNewAdrCity] = useState("");
  const [newAdrZip, setNewAdrZip] = useState("");
  const triggerToast = (msg, isSuccess = true) => {
    setToastMsg(msg);
    setSuccess(isSuccess);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };
  const handlePlaceOrder = (res) => {
    const itemCost = res.featuredItem.rate;
    if (balance < itemCost) {
      triggerToast("Order failed: Insufficient wallet balance!", false);
      setSelectedRes(null);
      return;
    }
    const chosenAddress = addresses.find((adr) => adr.id === selectedAddressId) || addresses[0];
    const deliveryLabel = chosenAddress ? `Delivered to: ${chosenAddress.street}, ${chosenAddress.city}` : `Prepared in ${res.time}`;
    const newBalance = balance - itemCost;
    updateBalance(newBalance);
    addTransaction({
      title: `${res.name} (Food Delivery)`,
      subtitle: `Ordered: ${res.featuredItem.name} \u2022 Just now`,
      amount: itemCost,
      type: "out",
      status: "Success"
    });
    addOrder({
      title: res.featuredItem.name,
      subtitle: `${res.name} \u2022 ${deliveryLabel}`,
      amount: itemCost,
      status: "Preparing",
      type: "food",
      image: res.image
    });
    triggerToast(`Order placed! \u20B9${itemCost} paid to ${res.name}. Delivering in ${res.time}!`);
    setSelectedRes(null);
  };
  const filteredRestaurants = restaurantsList.filter((res) => {
    const matchesCat = selectedCat === "All" || res.category === selectedCat || selectedCat === "Pure Veg" && res.tags.includes("Veg");
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || res.tags.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });
  return <div className="space-y-12 pb-12 font-sans relative">
      {
    /* Toast Alert */
  }
      <AnimatePresence>
        {showToast && <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className={cn(
      "fixed top-24 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl font-bold text-sm text-white",
      success ? "bg-emerald-600" : "bg-red-600"
    )}
  >
            {success ? <CheckCircle2 size={18} /> : <X size={18} className="bg-red-700 rounded-full p-0.5" />}
            <span>{toastMsg}</span>
          </motion.div>}
      </AnimatePresence>

      {
    /* Header & Location */
  }
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest">
              <MapPin size={14} />
              <span>Deliver to</span>
           </div>
           <button className="flex items-center gap-2 group">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-none">Koramangala, Bangalore</h1>
              <ChevronDown size={24} className="text-gray-400 group-hover:text-[#7C3AED] transition-colors" />
           </button>
        </div>
        
        <div className="flex gap-4">
           <button
    onClick={() => triggerToast("Search filtering parameters applied!")}
    className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#7C3AED] transition-all cursor-pointer shadow-sm active:scale-95"
  >
             <Filter size={20} />
           </button>
           <button
    onClick={() => triggerToast("Display mode changed to wide-grid!")}
    className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#7C3AED] transition-all cursor-pointer shadow-sm active:scale-95"
  >
             <Grid2X2 size={20} />
           </button>
        </div>
      </div>

      {
    /* Search Bar */
  }
      <div className="relative group max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" size={20} />
        <input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full bg-white border border-gray-100 rounded-[2rem] py-5 pl-16 pr-8 outline-none text-gray-900 font-medium text-lg focus:ring-4 focus:ring-purple-50 shadow-sm transition-all placeholder:text-gray-300"
    placeholder="Search for restaurants, dishes or cuisines..."
  />
        {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900">
            <X size={18} />
          </button>}
      </div>

      {
    /* Main Promo Banner */
  }
      <section className="relative h-[400px] rounded-[3rem] overflow-hidden group shadow-xl">
         <img
    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
    alt="Food Promo"
    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5s]"
  />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
         <div className="relative z-10 h-full p-16 flex flex-col justify-end text-white space-y-6">
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-orange-500 rounded-lg text-[10px] font-bold uppercase tracking-widest">Flash Deal</span>
               <span className="text-xs font-bold uppercase tracking-widest opacity-80">Up to ₹150 OFF</span>
            </div>
            <h2 className="text-5xl font-bold leading-tight">Hungry? We got <br /> you covered.</h2>
            <Button
    onClick={() => {
      const randomRes = RESTAURANTS[Math.floor(Math.random() * RESTAURANTS.length)];
      setSelectedRes(randomRes);
    }}
    className="w-fit h-14 px-8 rounded-2xl bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-xl cursor-pointer"
  >
              Order Now
            </Button>
         </div>
      </section>

      {
    /* Category Scroller */
  }
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat, i) => <button
    key={i}
    onClick={() => setSelectedCat(cat)}
    className={cn(
      "px-8 py-3.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer",
      selectedCat === cat ? "bg-gray-900 text-white shadow-lg" : "bg-white text-gray-500 border border-gray-100 hover:border-gray-200"
    )}
  >
            {cat}
          </button>)}
      </div>

      {
    /* Restaurant Grid */
  }
      <section className="space-y-8">
        <div className="flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-900">Popular Culinary Options</h3>
           <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Showing {filteredRestaurants.length} results</span>
        </div>
        
        {filteredRestaurants.length === 0 ? <div className="bg-white rounded-3xl p-16 text-center text-gray-400 font-bold border border-gray-100 shadow-sm">
            No restaurants found matching "{searchQuery}" under "{selectedCat}"
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredRestaurants.map((res) => <motion.div
    key={res.id}
    whileHover={{ y: -6 }}
    onClick={() => setSelectedRes(res)}
    className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
  >
                <div className="h-56 relative overflow-hidden rounded-[2rem] mb-6 shadow-sm">
                  <img
    src={res.image}
    alt={res.name}
    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
  />
                  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      triggerToast(`${res.name} pinned to favorites list!`);
    }}
    className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-red-50 backdrop-blur rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
  >
                    <Heart size={18} />
                  </button>
                  
                  {isAdmin && <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      window.location.href = `/admin/products?edit=${res.id}`;
    }}
    className="absolute top-4 left-4 bg-white/95 text-purple-700 hover:text-purple-900 font-bold px-3 py-2 rounded-xl text-xs z-20 transition-all shadow border border-slate-100 flex items-center gap-1.5 cursor-pointer"
  >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>}

                  {res.discount && <div className="absolute bottom-4 left-4 px-4 py-2 bg-[#7C3AED] text-white font-bold text-[10px] uppercase tracking-widest rounded-lg shadow-lg">
                      {res.discount}
                    </div>}
                </div>
                
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                     <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#7C3AED] transition-colors leading-tight">{res.name}</h4>
                     <div className="flex items-center gap-1 text-xs font-bold text-white bg-[#7C3AED] px-2 py-1 rounded-lg shrink-0">
                        <Star size={12} fill="currentColor" />
                        <span>{res.rating}</span>
                     </div>
                  </div>
                  <p className="text-sm font-medium text-gray-400 line-clamp-1">{res.tags}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <Clock size={16} className="text-[#7C3AED]" />
                      <span>{res.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                      <Banknote size={16} className="text-[#7C3AED]" />
                      <span>{res.price}</span>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </div>}
      </section>

      {
    /* Gold Membership Promotion Section */
  }
      <section className="bg-orange-50 rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center gap-12 border border-orange-100 relative overflow-hidden">
         <div className="flex-1 space-y-6 relative z-10">
            <h3 className="text-4xl font-bold text-gray-900 leading-tight font-sans">Order from your favorite <br /> local spots and get <span className="text-orange-500 italic font-medium">Unlimited Free Delivery</span>.</h3>
            <p className="text-gray-500 font-medium font-sans">Join OmniCart Gold to unlock exclusive discounts and priority fulfillment on every single order.</p>
            <Button
    onClick={() => {
      if (balance < 499) {
        triggerToast("Insufficient funds to purchase Gold membership!", false);
        return;
      }
      updateBalance(balance - 499);
      addTransaction({
        title: "OmniCart Gold Membership",
        subtitle: "Wellness and perks catalog purchase \u2022 Just now",
        amount: 499,
        type: "out",
        status: "Success"
      });
      triggerToast("Welcome to OmniCart Gold! Unlimited free delivery is now active.");
    }}
    className="h-16 px-12 rounded-2xl bg-orange-500 hover:bg-orange-650 text-white font-bold text-lg shadow-xl shadow-orange-150 cursor-pointer"
  >
              Unlock Gold Benefits (₹499)
            </Button>
         </div>
         <div className="w-full md:w-1/3 relative z-10">
            <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&auto=format&fit=crop" className="w-full rounded-[2.5rem] shadow-2xl rotate-3" alt="food" />
         </div>
         <Utensils className="absolute -left-10 -bottom-10 text-orange-200/30 rotate-12 pointer-events-none" size={300} />
      </section>

      {
    /* Menu / Checkout Modal Drawer */
  }
      <AnimatePresence>
        {selectedRes && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative p-10 space-y-6"
  >
              {
    /* Close Button */
  }
              <button
    onClick={() => setSelectedRes(null)}
    className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center border border-gray-100 cursor-pointer"
  >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#7C3AED]">Express Delivery Swiggy Order</span>
                <h3 className="text-xl font-bold text-gray-900">{selectedRes.name} Selection</h3>
                <p className="text-xs text-gray-400">Order gets settled instantly using your encrypted OmniCart account balance.</p>
              </div>

              <div className="border border-purple-100 bg-purple-50/50 p-6 rounded-3xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-purple-950 font-sans">{selectedRes.featuredItem.name}</h4>
                    <p className="text-xs text-purple-600/70 font-semibold mt-1">Single Chef Specialty Platter</p>
                  </div>
                  <span className="text-sm font-black text-[#7C3AED]">₹ {selectedRes.featuredItem.rate}</span>
                </div>
                <div className="h-[1px] bg-purple-100 w-full" />
                <div className="flex justify-between text-xs text-purple-900/60 font-semibold">
                  <span>Delivery Service Level</span>
                  <span className="text-emerald-600 font-bold">Priority Settle Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-bold text-gray-500 px-2 leading-tight">
                <span>Account balance:</span>
                <span>₹ {balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>

              {
    /* Delivery Address Identifier Section */
  }
              <div className="space-y-2 border-t border-gray-150 pt-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-sans">Shipment Destination Address</label>
                  <button
    type="button"
    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
    className="text-[10px] font-bold text-[#7C3AED] hover:underline"
  >
                    {showNewAddressForm ? "Select Saved" : "+ New Address"}
                  </button>
                </div>

                {showNewAddressForm ? <div className="space-y-2.5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <input
    type="text"
    placeholder="Receiver Name"
    value={newAdrName}
    onChange={(e) => setNewAdrName(e.target.value)}
    className="w-full h-10 px-3 bg-white border border-gray-150 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#7C3AED]/30"
  />
                    <input
    type="text"
    placeholder="Street Info (e.g. 102 Park Ave)"
    value={newAdrStreet}
    onChange={(e) => setNewAdrStreet(e.target.value)}
    className="w-full h-10 px-3 bg-white border border-gray-150 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#7C3AED]/30"
  />
                    <div className="grid grid-cols-2 gap-2">
                      <input
    type="text"
    placeholder="City"
    value={newAdrCity}
    onChange={(e) => setNewAdrCity(e.target.value)}
    className="w-full h-10 px-3 bg-white border border-gray-150 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#7C3AED]/30"
  />
                      <input
    type="text"
    placeholder="PIN Code"
    value={newAdrZip}
    onChange={(e) => setNewAdrZip(e.target.value)}
    className="w-full h-10 px-3 bg-white border border-gray-150 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#7C3AED]/30"
  />
                    </div>
                    <button
    type="button"
    onClick={() => {
      if (!newAdrName || !newAdrStreet || !newAdrCity) {
        triggerToast("Please complete all address fields first.", false);
        return;
      }
      const newId = `adr-${Date.now()}`;
      addAddress({
        name: newAdrName,
        street: newAdrStreet,
        city: newAdrCity,
        state: "Delhi",
        zip: newAdrZip,
        phone: "+91 98765 43210"
      });
      setShowNewAddressForm(false);
      setSelectedAddressId(newId);
      triggerToast("Delivery address saved successfully!");
    }}
    className="w-full h-8 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold uppercase transition"
  >
                      Save Delivery Address
                    </button>
                  </div> : <div>
                    {addresses.length === 0 ? <div className="text-[10px] text-yellow-600 bg-yellow-50 p-3 rounded-xl border border-yellow-100 font-medium">
                        No saved delivery address. Tap "+ New Address" to add.
                      </div> : <select
    value={selectedAddressId}
    onChange={(e) => setSelectedAddressId(e.target.value)}
    className="w-full h-10 px-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-1 focus:ring-[#7C3AED]/30"
  >
                        <option value="">-- Choose Shipment Address --</option>
                        {addresses.map((adr) => <option key={adr.id} value={adr.id}>
                            {adr.name} • {adr.street}, {adr.city}
                          </option>)}
                      </select>}
                  </div>}
              </div>

              <button
    type="button"
    onClick={() => {
      if (addresses.length > 0 && !selectedAddressId && !showNewAddressForm) {
        triggerToast("Please select a shipment delivery address first.", false);
        return;
      }
      handlePlaceOrder(selectedRes);
    }}
    className="w-full h-14 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
  >
                <ShoppingBag size={18} /> Purchase Meal (₹{selectedRes.featuredItem.rate})
              </button>
            </motion.div>
          </div>}
      </AnimatePresence>

      {isAdmin && <button
    onClick={() => window.location.href = "/admin/products?openAdd=true"}
    className="fixed bottom-24 right-8 bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-xl shadow-purple-600/20 flex items-center gap-2 transition-all z-40 hover:scale-105 cursor-pointer"
  >
          <Plus size={16} />
          <span>+ Add Item</span>
        </button>}
    </div>;
}
