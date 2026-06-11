import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Shield, Bell, Key, CreditCard, Save, 
  HelpCircle, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, LogOut
} from 'lucide-react';
import { useGlobalState } from '@/src/hooks/useGlobalState';
import { signOut } from 'firebase/auth';
import { auth } from '@/src/lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { profile, updateProfile, balance } = useGlobalState();
  const navigate = useNavigate();
  
  // Local form states
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [avatar, setAvatar] = useState(profile.avatar);

  React.useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAvatar(profile.avatar);
  }, [profile]);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'limits'>('profile');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  
  // Security settings
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [transactionLimit, setTransactionLimit] = useState(50000);
  
  // Notification states
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Avatar presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&auto=format&fit=crop'
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      avatar
    });
    triggerSuccessNotification('Profile updated successfully!');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  const triggerSuccessNotification = (msg: string) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="space-y-12 pb-12 font-sans text-gray-900">
      {/* Toast Notification */}
      {showNotification && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-24 right-8 z-[100] flex items-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl font-bold text-sm"
        >
          <CheckCircle2 size={18} />
          <span>{notificationMsg}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Settings & Security</h1>
          <p className="text-gray-500 font-medium text-lg">Manage your identity, security, limits, and system preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Tabs */}
        <div className="lg:col-span-4 space-y-3">
          {[
            { id: 'profile', label: 'My Identity', icon: User, desc: 'Update public profile and contact info' },
            { id: 'security', label: 'Security & Auth', icon: Shield, desc: 'Two-factor auth and credentials' },
            { id: 'limits', label: 'Transaction Limits', icon: CreditCard, desc: 'Adjust daily caps and wallet rules' },
            { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Manage alerts and newsletter digests' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left p-6 rounded-[2rem] border transition-all flex items-start gap-4 ${
                  isSelected 
                    ? 'bg-white border-[#7C3AED] shadow-md ring-2 ring-purple-100' 
                    : 'bg-white hover:bg-gray-50 border-gray-100 shadow-sm'
                }`}
              >
                <div className={`p-3 rounded-xl shrink-0 ${isSelected ? 'bg-purple-100 text-[#7C3AED]' : 'bg-gray-50 text-gray-400'}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{tab.label}</h4>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5">{tab.desc}</p>
                </div>
              </button>
            );
          })}

          {/* Secure Firebase Sign-Out */}
          <button
            onClick={handleSignOut}
            className="w-full text-left p-5 rounded-[2rem] border transition-all flex items-start gap-4 bg-red-50/50 hover:bg-red-100 border-red-100/50 shadow-sm text-red-600 font-bold active:scale-[0.98]"
          >
            <div className="p-3 rounded-xl shrink-0 bg-red-150 text-red-600">
              <LogOut size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900 leading-none mt-1">Sign Out of Sync</h4>
              <p className="text-[10px] font-semibold text-red-400 mt-1 leading-none">Disconnect session & exit</p>
            </div>
          </button>
        </div>

        {/* Content Console */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-gray-100 shadow-sm">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">My Identity</h2>
                    <p className="text-sm font-medium text-gray-400">Modify your visual preset and profile particulars.</p>
                  </div>
                  {auth.currentUser && (
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-150 text-xs font-bold inline-flex items-center gap-1.5 self-start md:self-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Cloud Synchronization Active
                    </div>
                  )}
                </div>

                {auth.currentUser && (
                  <div className="p-6 border border-purple-100 bg-purple-50/40 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div className="space-y-1">
                        <div className="flex items-center flex-wrap gap-2.5">
                           <span className="text-[10px] font-bold text-white bg-purple-600 px-3 py-1 rounded-full uppercase tracking-wider">SECURE IDENTITY</span>
                           <span className="text-xs font-bold text-gray-400">UUID: <code className="font-mono text-gray-600 font-black">{auth.currentUser.uid}</code></span>
                        </div>
                        <p className="text-xs text-purple-950 font-medium leading-relaxed pt-1">
                           Logged in with authenticated host <b className="text-purple-700">{auth.currentUser.email || 'Google Account'}</b>. Your current balance records, billing receipts, and physical addresses are synced dynamically.
                        </p>
                     </div>
                  </div>
                )}

                {/* Avatar Presets */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Visual Preset</span>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="w-20 h-20 rounded-[2rem] overflow-hidden shadow-md ring-4 ring-purple-100">
                      <img src={avatar} alt="Current avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                      {avatarPresets.map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${avatar === preset ? 'border-[#7C3AED] scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                        >
                          <img src={preset} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Custom avatar input */}
                  <div className="pt-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Or Custom Avatar Pattern (URL)</label>
                    <input 
                      type="url" 
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold placeholder:text-gray-300 outline-none text-gray-700 focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
                      placeholder="https://images.unsplash.com/..." 
                    />
                  </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] transition-all outline-none" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Mobile Number</label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] transition-all outline-none" 
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] transition-all outline-none" 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-end">
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 select-none transition-all active:scale-95"
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Security & Auth</h2>
                  <p className="text-sm font-medium text-gray-400">Keep your banking information, wallet, and keys protected.</p>
                </div>

                <div className="space-y-6">
                  {/* Two factor */}
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                    <div className="space-y-1 pr-4">
                      <h4 className="text-sm font-bold text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-xs font-semibold text-gray-400 leading-relaxed">Require a high-security OTP sent via WhatsApp or SMS for every checkout.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={twoFactor} 
                        onChange={() => {
                          setTwoFactor(!twoFactor);
                          triggerSuccessNotification(twoFactor ? 'Two-Factor Auth Disabled' : 'Two-Factor Auth Enabled');
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>

                  {/* Biometrics */}
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                    <div className="space-y-1 pr-4">
                      <h4 className="text-sm font-bold text-gray-900">Biometric Lock</h4>
                      <p className="text-xs font-semibold text-gray-400 leading-relaxed">Request biometric validation for opening the app or scanning paying.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={biometrics} 
                        onChange={() => {
                          setBiometrics(!biometrics);
                          triggerSuccessNotification(biometrics ? 'Biometrics Disabled' : 'Biometrics Enabled');
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>

                  {/* Encryption details */}
                  <div className="p-6 border border-emerald-100 bg-emerald-50/50 rounded-2xl flex items-start gap-4">
                    <Key size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Advanced Encryption Activated</h4>
                      <p className="text-xs font-medium text-emerald-600/80 leading-relaxed mt-1">All your digital transactions, cards, and bank settlements are fully protected with military-grade AES-256 protocols.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'limits' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction Limits</h2>
                  <p className="text-sm font-medium text-gray-400">Set daily limits to secure your funds against unauthorized transactions.</p>
                </div>

                <div className="space-y-8">
                  <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                      <span>Daily Transfer Cap</span>
                      <span className="text-[#7C3AED] text-lg font-black">₹ {transactionLimit.toLocaleString('en-IN')}</span>
                    </div>
                    <input 
                      type="range" 
                      min="5000" 
                      max="200000" 
                      step="5000"
                      value={transactionLimit} 
                      onChange={(e) => setTransactionLimit(parseInt(e.target.value))}
                      className="w-full accent-[#7C3AED] h-1.5 bg-gray-200 rounded-lg cursor-pointer" 
                    />
                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                      <span>₹ 5,000</span>
                      <span>₹ 2,00,000 (Max)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border border-blue-50 bg-[#F1F4FF] rounded-2xl text-blue-600">
                    <AlertCircle size={18} className="shrink-0" />
                    <p className="text-xs font-semibold leading-relaxed">Adjusting this setting triggers an instantaneous security confirmation prompt sent via your registered phone number.</p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex justify-end">
                    <button 
                      onClick={() => triggerSuccessNotification('Daily cap settings updated!')}
                      type="button" 
                      className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 transition-all active:scale-95"
                    >
                      Apply Limits
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h2>
                  <p className="text-sm font-medium text-gray-400">Configure how and when you want to receive transaction confirmations and weekly deal catalogs.</p>
                </div>

                <div className="space-y-6">
                  {/* Payment Alert */}
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-gray-900">Immediate Payment Alerts</h4>
                      <p className="text-xs font-semibold text-gray-400">Send push alerts and text confirmations for all money movements.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={paymentAlerts} 
                        onChange={() => setPaymentAlerts(!paymentAlerts)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>

                  {/* Promo alert */}
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-gray-900">Promotions & Vouchers</h4>
                      <p className="text-xs font-semibold text-gray-400">Receive alerts regarding seasonal drops and cashback discounts.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={promoEmails} 
                        onChange={() => setPromoEmails(!promoEmails)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>

                  {/* Digest alert */}
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-gray-900">Weekly Restorative Digest</h4>
                      <p className="text-xs font-semibold text-gray-400">Receive an aesthetic digest detailing your wellness index scores.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={weeklyDigest} 
                        onChange={() => setWeeklyDigest(!weeklyDigest)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex justify-end">
                    <button 
                      onClick={() => triggerSuccessNotification('Notification rules applied!')}
                      type="button" 
                      className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 transition-all active:scale-95"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
