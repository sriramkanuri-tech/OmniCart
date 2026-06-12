import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Star, Package, ShieldAlert, X } from 'lucide-react';
import toast from 'react-hot-toast';
const CATEGORIES = ['All', 'Watches', 'Audio', 'Beauty', 'Furniture', 'Food', 'Travel', 'Bills'];
export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  // Modal tracking states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('Watches');
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formRating, setFormRating] = useState('4.5');
  const [formBrand, setFormBrand] = useState('');
  const [formImage, setFormImage] = useState('');

  // Delete Prompt
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/products', {
        headers: {
          'x-admin-email': 'sriramkanuri4@gmail.com'
        }
      });
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to retrieve system products catalog.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const checkParams = async () => {
      const response = await axios.get('/api/admin/products', {
        headers: {
          'x-admin-email': 'sriramkanuri4@gmail.com'
        }
      });
      const allProducts = response.data || [];
      setProducts(allProducts);
      setLoading(false);
      if (window.location.search.includes('openAdd=true')) {
        setTimeout(() => {
          openAddModal();
        }, 150);
      } else {
        const match = window.location.search.match(/[?&]edit=([^&]+)/);
        if (match && match[1]) {
          const prodId = match[1];
          const found = allProducts.find(p => String(p.id) === String(prodId));
          if (found) {
            setTimeout(() => {
              openEditModal(found);
            }, 150);
          }
        }
      }
    };
    checkParams();
  }, []);
  const openAddModal = () => {
    setModalMode('add');
    setSelectedProductId(null);
    setFormName('');
    setFormPrice('');
    setFormCategory('Watches');
    setFormDescription('');
    setFormBadge('');
    setFormRating('4.5');
    setFormBrand('');
    setFormImage('');
    setIsModalOpen(true);
  };
  const openEditModal = product => {
    setModalMode('edit');
    setSelectedProductId(product.id);
    setFormName(product.name);
    // Remove currency symbol if editing
    setFormPrice(String(product.rate || product.price).replace(/[^0-9.]/g, ''));
    setFormCategory(product.category || 'Watches');
    setFormDescription(product.description || '');
    setFormBadge(product.badge || '');
    setFormRating(product.rating || '4.5');
    setFormBrand(product.brand || '');
    setFormImage(product.image || '');
    setIsModalOpen(true);
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    if (!formName || !formPrice || !formCategory) {
      toast.error('Please enter Name, Price, and Category.');
      return;
    }
    const payload = {
      name: formName,
      price: formPrice,
      category: formCategory,
      description: formDescription,
      badge: formBadge,
      rating: formRating,
      brand: formBrand || 'OmniCart',
      image: formImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
    };
    try {
      if (modalMode === 'add') {
        const res = await axios.post('/api/admin/products', payload, {
          headers: {
            'x-admin-email': 'sriramkanuri4@gmail.com'
          }
        });
        toast.success(`Product "${formName}" created successfully!`);
      } else {
        await axios.put(`/api/admin/products/${selectedProductId}`, payload, {
          headers: {
            'x-admin-email': 'sriramkanuri4@gmail.com'
          }
        });
        toast.success(`Product details updated successfully.`);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error(err?.response?.data?.error || 'Failed to persist product record.');
    }
  };
  const handleDeleteProduct = async (id, name) => {
    try {
      await axios.delete(`/api/admin/products/${id}`, {
        headers: {
          'x-admin-email': 'sriramkanuri4@gmail.com'
        }
      });
      toast.success(`Product "${name}" deleted successfully.`);
      setConfirmDeleteId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Could not complete deletion command.');
    }
  };
  const filteredProducts = products.filter(p => activeTab === 'All' || p.category?.toLowerCase() === activeTab.toLowerCase());
  return <div className="space-y-8 text-slate-800 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Products Catalog</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage active listings, categories, pricing grids, and images.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-purple-600/10 cursor-pointer transition-all">
          <Plus className="w-4.5 h-4.5" />
          <span>Add Custom Listing</span>
        </button>
      </div>

      {/* Tabs list styled horizontally */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none">
        {CATEGORIES.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`
              px-5 py-2.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer transition-all
              ${activeTab === tab ? 'bg-[#0F172A] text-white' : 'bg-white border border-slate-100 text-slate-500 hover:text-slate-800 hover:border-slate-300'}
            `}>
            {tab}
          </button>)}
      </div>

      {/* Products Grid */}
      {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white border border-slate-100 h-96 rounded-3xl animate-pulse" />)}
        </div> : filteredProducts.length === 0 ? <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm max-w-xl mx-auto">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 text-lg">No Listings Present</h3>
          <p className="text-slate-400 text-sm mt-1">No products reside under the "{activeTab}" tab category.</p>
          <button onClick={openAddModal} className="mt-5 inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Create First Item</span>
          </button>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(p => <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow relative">
              {/* Product Card Image container */}
              <div className="h-52 overflow-hidden relative bg-slate-50">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Optional Badge */}
                {p.badge && <span className="absolute top-4 left-4 bg-[#7C3AED] text-white font-extrabold text-[9px] px-2.5 py-1 rounded-lg uppercase shadow">
                    {p.badge}
                  </span>}

                {/* Star rating overlay */}
                <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs text-slate-800 font-extrabold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{p.rating}</span>
                </span>
                
                {/* Category tab indicator */}
                <span className="absolute top-4 right-4 bg-slate-900/40 backdrop-blur-xs text-white font-bold text-[9px] px-2 py-0.5 rounded-md uppercase">
                  {p.category}
                </span>
              </div>

              {/* Bottom Card content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{p.brand || 'OmniCart'}</span>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{p.description || 'Premium listing offered by OmniCart merchants.'}</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#0F172A] font-black text-lg">
                    ₹{(p.rate || parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0).toLocaleString('en-IN')}
                  </span>

                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(p)} className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer" title="Edit Item">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDeleteId(p.id)} className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl transition-colors cursor-pointer" title="Delete Item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* In-Card Delete Prompt Confirmation */}
              {confirmDeleteId === p.id && <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-fade-in">
                  <ShieldAlert className="w-10 h-10 text-red-500 animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">Remove this product?</h4>
                    <p className="text-[10px] text-slate-300 px-4">This action can't be undone. The product will be unlisted.</p>
                  </div>
                  <div className="flex gap-2.5 w-full max-w-[200px]">
                    <button onClick={() => setConfirmDeleteId(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-xl text-xs font-bold transition-all">
                      Abort
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id, p.name)} className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-xl text-xs font-bold transition-all">
                      Delete
                    </button>
                  </div>
                </div>}
            </div>)}
        </div>}

      {/* Add / Edit Overlay Modal */}
      {isModalOpen && <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 flex flex-col justify-between max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {modalMode === 'add' ? 'Publish New Product' : 'Configure Product Details'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Define merchant listings details, identifiers, and price grids.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Product Name *</label>
                  <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300" placeholder="e.g. Classic Watch" />
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Price (₹) *</label>
                  <input type="number" required value={formPrice} onChange={e => setFormPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300" placeholder="e.g. 1500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Sector/Category *</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300">
                    {CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold">Brand / Provider Name</label>
                  <input type="text" value={formBrand} onChange={e => setFormBrand(e.target.value)} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300" placeholder="e.g. Rolex / Pizza Hut" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Badge Tag (e.g. Limited Edition)</label>
                  <input type="text" value={formBadge} onChange={e => setFormBadge(e.target.value)} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300" placeholder="e.g. TRENDING" />
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Rating (0 - 5)</label>
                  <input type="number" step="0.1" min="1" max="5" value={formRating} onChange={e => setFormRating(e.target.value)} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="uppercase tracking-wider">Media Showcase Image URL</label>
                <input type="url" value={formImage} onChange={e => setFormImage(e.target.value)} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300 text-xs font-mono" placeholder="e.g. https://images.unsplash.com/..." />
              </div>

              <div className="space-y-1">
                <label className="uppercase tracking-wider">Description</label>
                <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-slate-800 font-medium outline-none focus:border-purple-300 text-xs leading-relaxed" placeholder="Summarize product specifications..." />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 font-sans font-bold text-xs">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 px-5 py-3 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="bg-[#7C3AED] hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer">
                  {modalMode === 'add' ? 'Publish Item' : 'Update Details'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
}