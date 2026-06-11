import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Plane, Utensils, CreditCard, 
  Gift, Headphones, ArrowRight, Eye, EyeOff,
  ShieldCheck, Smartphone, Mail, Lock, CheckCircle,
  User
} from 'lucide-react';
import { Button, Input } from '@/src/components/ui/Inputs';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

// Firebase imports
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Email/Password mode states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle standard password auth via Firebase
  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const emailTrimmed = email.trim();
      const passwordTrimmed = password.trim();

      if (!emailTrimmed || !passwordTrimmed) {
        throw new Error('Please enter all required details.');
      }

      if (isLogin) {
        // Log in existing user
        try {
          await signInWithEmailAndPassword(auth, emailTrimmed, passwordTrimmed);
          navigate('/dashboard');
        } catch (err: any) {
          console.error("Login error code:", err.code, err);
          if (
            err.code === 'auth/user-not-found' || 
            err.code === 'auth/invalid-login-credentials' || 
            err.code === 'auth/invalid-credential'
          ) {
            throw new Error("User record not found or password incorrect. If you are a new user, you must use 'Sign Up' first (link in top right!)");
          } else if (err.code === 'auth/invalid-email') {
            throw new Error("Invalid email format. Please enter a valid email address.");
          } else {
            throw new Error(err.message || "Failed to sign in. Please verify your credentials.");
          }
        }
      } else {
        // Sign up new user
        if (!fullName.trim()) {
          throw new Error('Please enter your full name to create an account.');
        }
        
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, emailTrimmed, passwordTrimmed);
          if (userCredential.user) {
            await updateProfile(userCredential.user, {
              displayName: fullName.trim()
            });
          }
          navigate('/dashboard');
        } catch (err: any) {
          console.error("Register error:", err);
          if (err.code === 'auth/email-already-in-use') {
            throw new Error("This email is already registered. If you already have an account, click 'Sign In' in the top right to log in.");
          } else if (err.code === 'auth/weak-password') {
            throw new Error("Password is too weak. Please use at least 6 characters.");
          } else if (err.code === 'auth/invalid-email') {
            throw new Error("Invalid email format. Please enter a valid email address.");
          } else {
            throw new Error(err.message || "Failed to create account. Please check your details.");
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth sign-in handler
  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError(err?.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  // GitHub OAuth sign-in handler
  const handleGithubSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("GitHub Sign-In Error:", err);
      setError(err?.message || "Failed to sign in with GitHub.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-[#1a1a1a]">
      {/* Invisible Recaptcha Target */}
      <div id="recaptcha-container"></div>

      {/* Left side - Product Showcase */}
      <div className="hidden lg:flex flex-[1.2] bg-[#4F46E5] relative overflow-hidden p-16 flex-col justify-between auth-gradient rounded-r-[4rem]">
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
             <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl shadow-lg">
                <ShoppingBag className="text-[#7C3AED]" size={24} strokeWidth={2.5} />
             </div>
             <div className="flex flex-col">
               <span className="text-2xl font-bold text-white tracking-tight leading-none">OmniCart</span>
               <span className="text-[10px] text-white/70 font-medium">One App. All Your Needs.</span>
             </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md"
          >
            <h1 className="text-[4rem] font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Everything You Need, <br />
              <span className="text-white/60">One Super App.</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed font-medium">
              Shop, travel, eat, pay and more — all in one secure and smart app.
            </p>
          </motion.div>
        </div>

        {/* Center Mockup & Floating Cards */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-20">
           <div className="relative">
             {/* iPhone Mockup */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 w-[300px] h-[600px] bg-[#1a1a1a] rounded-[3rem] border-[8px] border-[#2a2a2a] shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#2a2a2a] rounded-b-2xl z-30" />
                <div className="p-6 pt-10 h-full bg-[#f8f9fa] flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-xs text-gray-400">Hi, Aarav 👋</p>
                      <p className="font-bold text-sm">Good Morning!</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" alt="avatar" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-4 text-white shadow-xl">
                    <p className="text-[10px] opacity-80 mb-1">Wallet Balance</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold">₹ 12,450.00</p>
                      <Eye size={14} className="opacity-60" />
                    </div>
                    <button className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] font-bold w-fit">
                      + Add Money
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-2">
                     {[ShoppingBag, Plane, Utensils, CreditCard].map((Icon, i) => (
                       <div key={i} className="flex flex-col items-center gap-1">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm",
                            i === 0 ? "bg-pink-100 text-pink-600" :
                            i === 1 ? "bg-blue-100 text-blue-600" :
                            i === 2 ? "bg-orange-100 text-orange-600" :
                            "bg-indigo-100 text-indigo-600"
                          )}>
                             <Icon size={18} />
                          </div>
                          <span className="text-[8px] font-bold text-gray-500">Service</span>
                       </div>
                     ))}
                  </div>

                  <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-800 mb-3">Recent Activity</p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"><ShoppingBag size={14} /></div>
                           <div className="flex-1"><p className="text-[9px] font-bold">Amazon Shopping</p><p className="text-[8px] text-gray-400">Today, 10:30 AM</p></div>
                           <p className="text-[9px] font-bold text-red-500">- ₹1,499</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"><Smartphone size={14} /></div>
                           <div className="flex-1"><p className="text-[9px] font-bold">Mobile Recharge</p><p className="text-[8px] text-gray-400">Yesterday</p></div>
                           <p className="text-[9px] font-bold text-red-500">- ₹350</p>
                        </div>
                    </div>
                  </div>
                </div>
              </motion.div>
                        {/* Floating Cards */}
             <motion.div 
               animate={{ y: [0, -6, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-20 left-0 z-30 bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 w-28"
             >
               <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center"><ShoppingBag size={20} /></div>
               <p className="text-[10px] font-bold">Shopping</p>
               <p className="text-[8px] text-gray-400 whitespace-nowrap">Best Deals</p>
             </motion.div>

             <motion.div 
               animate={{ y: [0, 6, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-60 left-0 z-30 bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 w-28"
             >
               <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Plane size={20} /></div>
               <p className="text-[10px] font-bold">Travel</p>
               <p className="text-[8px] text-gray-400 whitespace-nowrap">Book Tickets</p>
             </motion.div>

             <motion.div 
               animate={{ y: [0, -5, 0] }}
               transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-[26rem] left-0 z-30 bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 w-28"
             >
               <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center"><Utensils size={20} /></div>
               <p className="text-[10px] font-bold">Food Delivery</p>
               <p className="text-[8px] text-gray-400 whitespace-nowrap">Tasty & Fast</p>
             </motion.div>

             <motion.div 
               animate={{ y: [0, 8, 0] }}
               transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-32 right-0 z-30 bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 w-28"
             >
               <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center"><CreditCard size={20} /></div>
               <p className="text-[10px] font-bold">Payments</p>
               <p className="text-[8px] text-gray-400 whitespace-nowrap">Pay & Transfer</p>
             </motion.div>

             <motion.div 
               animate={{ y: [0, -7, 0] }}
               transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-72 right-0 z-30 bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 w-28"
             >
               <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center"><Gift size={20} /></div>
               <p className="text-[10px] font-bold">Rewards</p>
               <p className="text-[8px] text-gray-400 whitespace-nowrap">Earn More</p>
             </motion.div>

             <motion.div 
               animate={{ y: [0, 5, 0] }}
               transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-[28rem] right-0 z-30 bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 w-28"
             >
               <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center"><Headphones size={20} /></div>
               <p className="text-[10px] font-bold">Support</p>
               <p className="text-[8px] text-gray-400 whitespace-nowrap">24/7 Help</p>
             </motion.div>

             {/* Bottom Platform */}
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-32 bg-purple-900/40 rounded-[50%] blur-3xl z-10" />
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[280px] h-12 bg-purple-800 rounded-full z-10 shadow-2xl border-t border-white/20" />
           </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-[12px] font-bold text-white/90">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2 underline decoration-white/30 decoration-2 underline-offset-4">
              <span>Fast</span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span>Reliable</span>
            </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <div className="absolute top-8 right-8 z-10">
           <p className="text-sm font-medium text-gray-500">
             Don't have an account? {' '}
             <button 
               onClick={() => setIsLogin(!isLogin)}
               className="text-[#7C3AED] font-bold hover:underline"
             >
               {isLogin ? 'Sign Up' : 'Sign In'}
             </button>
           </p>
        </div>

        <div className="flex-1 flex flex-col justify-center py-20 px-8 md:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full mx-auto"
          >
            <div className="lg:hidden flex items-center gap-3 mb-10">
               <div className="w-10 h-10 bg-[#7C3AED] flex items-center justify-center rounded-xl">
                  <ShoppingBag className="text-white" size={20} />
               </div>
               <span className="text-xl font-bold tracking-tight">OmniCart</span>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-gray-500 font-medium">
                {isLogin ? 'Log in with SMS verification or standard credentials.' : 'Join thousands of smart users today.'}
              </p>
            </div>

            {/* ERROR SUMMARY */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold leading-relaxed shadow-sm">
                ⚠️ {error}
              </div>
            )}

            {/* ERROR SUMMARY */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold leading-relaxed shadow-sm">
                ⚠️ {error}
              </div>
            )}

            {/* FORM LOGIC CONTAINER */}
            <AnimatePresence mode="wait">
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-6"
              >
                <form onSubmit={handlePasswordAuth} className="space-y-6">
                  <AnimatePresence initial={false}>
                    {!isLogin && (
                      <motion.div
                        key="fullname-field"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4">
                          <Input 
                            label="Full Name" 
                            placeholder="e.g. Aarav Sharma" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            icon={<User size={18} />}
                            className="bg-gray-50/50 border-gray-100"
                            required
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Input 
                    label="Email Address" 
                    type="email"
                    placeholder="e.g. mail@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={18} />}
                    className="bg-gray-50/50 border-gray-100"
                    required
                  />
                  <div className="space-y-3">
                    <div className="relative">
                      <Input 
                        label="Password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock size={18} />}
                        className="bg-gray-50/50 border-gray-100"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[3.25rem] -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {isLogin && (
                      <div className="text-right">
                        <button type="button" className="text-sm font-bold text-[#7C3AED] hover:underline transition-colors">
                          Forgot Password?
                        </button>
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-purple-300 shadow-lg shadow-purple-200 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 group mt-2"
                  >
                    {isLogin ? (loading ? 'Signing In...' : 'Login') : (loading ? 'Creating Account...' : 'Create Account')}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </motion.div>
            </AnimatePresence>

            {/* OAuth SECTION */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
                <span className="bg-white px-4 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="h-14 px-6 rounded-2xl border border-gray-150 bg-white hover:bg-gray-100 flex items-center justify-center gap-3 text-xs font-bold text-gray-700 transition active:scale-95 shadow-sm cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-3.3-4.53-5.29-4.53z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleGithubSignIn}
                disabled={loading}
                className="h-14 px-6 rounded-2xl border border-gray-150 bg-white hover:bg-gray-100 flex items-center justify-center gap-3 text-xs font-bold text-gray-700 transition active:scale-95 shadow-sm cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>


            
            <div className="mt-12 flex items-center justify-center gap-4 bg-purple-50 p-6 rounded-3xl border border-purple-100">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                  <ShieldCheck size={20} />
               </div>
               <div className="flex-1">
                 <p className="text-xs font-bold text-gray-900 mb-0.5">Your data is 100% secure</p>
                 <p className="text-[10px] text-gray-400 font-medium">We never share your data with anyone.</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
