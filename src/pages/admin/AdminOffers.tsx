import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Plus, Edit2, Trash2, Tag, Calendar, ShoppingBag, 
  ToggleLeft, ToggleRight, X, Sparkles, Inbox
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  bannerImage: string;
  validUntil: string;
  badge: string;
  active: boolean;
}

const CATEGORIES = ['All Services', 'Watches', 'Audio', 'Beauty', 'Furniture', 'Food', 'Travel', 'Bills'];

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal control state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  // Form Fields State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDiscount, setFormDiscount] = useState('');
  const [formCategory, setFormCategory] = useState('All Services');
  const [formBannerImage, setFormBannerImage] = useState('');
  const [formValidUntil, setFormValidUntil] = useState('');
  const [formBadge, setFormBadge] = useState('');

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/offers', {
        headers: { 'x-admin-email': 'sriramkanuri4@gmail.com' }
      });
      setOffers(response.data || []);
    } catch (err: any) {
      console.error('Error fetching offers:', err);
      toast.error('Failed to retrieve active promotions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    if (window.location.search.includes('openAdd=true')) {
      setTimeout(() => {
        openAddModal();
      }, 150);
    }
  }, []);

  const handleToggleActive = async (offer: Offer) => {
    const nextState = !offer.active;
    try {
      await axios.put(`/api/admin/offers/${offer.id}`, { active: nextState }, {
        headers: { 'x-admin-email': 'sriramkanuri4@gmail.com' }
      });
      toast.success(`Banner status set to ${nextState ? 'Active' : 'Inactive'}.`);
      fetchOffers();
    } catch (error) {
      console.error('Error toggling offer status:', error);
      toast.error('Failed to shift promo status.');
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedOfferId(null);
    setFormTitle('');
    setFormDescription('');
    setFormDiscount('');
    setFormCategory('All Services');
    setFormBannerImage('');
    setFormValidUntil('');
    setFormBadge('');
    setIsModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setModalMode('edit');
    setSelectedOfferId(offer.id);
    setFormTitle(offer.title);
    setFormDescription(offer.description);
    setFormDiscount(offer.discount);
    setFormCategory(offer.category || 'All Services');
    setFormBannerImage(offer.bannerImage || '');
    setFormValidUntil(offer.validUntil || '');
    setFormBadge(offer.badge || '');
    setIsModalOpen(true);
  };

  const handleDeleteOffer = async (id: string, title: string) => {
    if (!window.confirm(`Are you absolutely sure you want to remove offer "${title}"?`)) {
      return;
    }
    try {
      await axios.delete(`/api/admin/offers/${id}`, {
        headers: { 'x-admin-email': 'sriramkanuri4@gmail.com' }
      });
      toast.success('Offer removed from system.');
      fetchOffers();
    } catch (err: any) {
      console.error('Error deleting offer:', err);
      toast.error('Could not complete deletion command.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formDiscount) {
      toast.error('Please enter Title, Description, and Discount.');
      return;
    }

    const payload = {
      title: formTitle,
      description: formDescription,
      discount: formDiscount,
      category: formCategory,
      bannerImage: formBannerImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
      validUntil: formValidUntil || '2026-12-31',
      badge: formBadge || 'PROMO',
    };

    try {
      if (modalMode === 'add') {
        await axios.post('/api/admin/offers', payload, {
          headers: { 'x-admin-email': 'sriramkanuri4@gmail.com' }
        });
        toast.success(`Coupon/Offer "${formTitle}" added successfully!`);
      } else {
        await axios.put(`/api/admin/offers/${selectedOfferId}`, payload, {
          headers: { 'x-admin-email': 'sriramkanuri4@gmail.com' }
        });
        toast.success('Offer details updated successfully.');
      }
      setIsModalOpen(false);
      fetchOffers();
    } catch (err: any) {
      console.error('Error saving offer:', err);
      toast.error('Unhandled database error occurred.');
    }
  };

  return (
    <div className="space-y-8 text-slate-800 font-sans">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Campaigns & Offers</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Design checkout campaigns, banners, vouchers, and cashback triggers.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-purple-600/10 cursor-pointer transition-all"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Promotion</span>
        </button>
      </div>

      {/* Offers Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 h-64 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm max-w-xl mx-auto">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-bounce" />
          <h3 className="font-bold text-slate-700 text-lg">No Active Campaigns</h3>
          <p className="text-slate-400 text-sm mt-1">There are no operational discounts available currently inside OmniCart.</p>
          <button
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Launch First Promotion</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((off) => (
            <div 
              key={off.id} 
              className={`
                bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all relative
                ${!off.active ? 'opacity-65 grayscale-[30%]' : ''}
              `}
            >
              {/* Promo Image header */}
              <div className="h-44 overflow-hidden relative bg-slate-50">
                <img 
                  src={off.bannerImage} 
                  alt={off.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge overlay */}
                {off.badge && (
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-lg uppercase shadow">
                    {off.badge}
                  </span>
                )}

                {/* Offer amount / voucher overlay */}
                <span className="absolute bottom-4 left-4 bg-slate-900/90 text-white font-extrabold text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                  <span>{off.discount}</span>
                </span>

                {/* Sector marker */}
                <span className="absolute top-4 right-4 bg-purple-100 text-purple-700 font-extrabold text-[9px] px-2.5 py-1 rounded-lg uppercase">
                  {off.category}
                </span>
              </div>

              {/* Offer Info body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-base">{off.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{off.description}</p>
                </div>

                {/* Footer specs / Toggles */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-extrabold uppercase">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Until: {off.validUntil}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Active/Inactive Switch Toggle */}
                    <button
                      onClick={() => handleToggleActive(off)}
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={off.active ? 'Deactivate Offer' : 'Activate Offer'}
                    >
                      {off.active ? (
                        <ToggleRight className="w-9 h-9 text-[#7C3AED]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-slate-300" />
                      )}
                    </button>

                    {/* Edit Option */}
                    <button
                      onClick={() => openEditModal(off)}
                      className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="Edit Campaign"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Option */}
                    <button
                      onClick={() => handleDeleteOffer(off.id, off.title)}
                      className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl transition-colors cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Campaigns Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 flex flex-col justify-between max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {modalMode === 'add' ? 'Launch Promo Campaign' : 'Configure Campaign Guidelines'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Determine rewards boundaries, voucher conditions, and discount rates.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-500">
              <div className="space-y-1">
                <label className="uppercase tracking-wider">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300"
                  placeholder="e.g. Get 10% Cashback"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Discount Rate/Amount *</label>
                  <input
                    type="text"
                    required
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300"
                    placeholder="e.g. 10% Cashback / ₹200 OFF"
                  />
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Target Sector/Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Badge Text</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300"
                    placeholder="e.g. LIMITED OFFER"
                  />
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Valid Until Date *</label>
                  <input
                    type="date"
                    required
                    value={formValidUntil}
                    onChange={(e) => setFormValidUntil(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="uppercase tracking-wider">Promo Banner Image URL</label>
                <input
                  type="url"
                  value={formBannerImage}
                  onChange={(e) => setFormBannerImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300 text-xs font-mono"
                  placeholder="e.g. https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="uppercase tracking-wider">Promotion Terms/Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  required
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300 text-xs leading-relaxed"
                  placeholder="e.g. Receive 10% instant coins back in your wallet instantly at successful UroPay checkout fields..."
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 font-sans font-bold text-xs">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 px-5 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#7C3AED] hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {modalMode === 'add' ? 'Publish Campaign' : 'Update Guidelines'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
