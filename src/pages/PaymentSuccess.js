import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { saveOrder, getOrderStatus } from '../services/api';
import { CheckCircle2, ShoppingBag, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useGlobalState } from '../hooks/useGlobalState';
export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    profile
  } = useGlobalState();
  const orderId = searchParams.get('orderId');
  const amountStr = searchParams.get('amount') || '0';
  const product = searchParams.get('product') || 'OmniCart Product';
  const category = searchParams.get('category') || 'Shopping';
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('PENDING');
  const [waitingLong, setWaitingLong] = useState(false);
  useEffect(() => {
    let pollInterval;
    let timeoutId;
    const confirmBackupOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const userEmail = profile?.email || 'guest@omnicart.com';
        const userName = profile?.name || 'Customer';
        const amount = parseFloat(amountStr);
        console.log(`[PaymentSuccess] Success-Load. Triggering backup save API call for orderId: ${orderId}`);
        await saveOrder({
          orderId,
          productName: product,
          amount,
          category,
          userEmail,
          userName,
          uropayTransactionId: 'frontend_fallback_tx',
          status: 'PLACED' // Assuming saveOrder might take status, but backend will ensure it's PLACED if PENDING
        });
      } catch (err) {
        console.error('[PaymentSuccess] Error triggering backup order confirmation:', err);
      }
    };
    const pollStatus = async () => {
      if (!orderId) return;
      try {
        const res = await getOrderStatus(orderId);
        if (res?.order?.status) {
          setStatus(res.order.status);
          if (res.order.status === 'PLACED' || res.order.status === 'PAID') {
            setLoading(false);
            clearInterval(pollInterval);
            confetti({
              particleCount: 150,
              spread: 80,
              origin: {
                y: 0.6
              },
              colors: ['#7c3aed', '#a78bfa', '#10b981', '#34d399']
            });
          }
        }
      } catch (err) {
        console.error('[PaymentSuccess] Error polling status:', err);
      }
    };
    confirmBackupOrder().then(() => {
      pollInterval = setInterval(pollStatus, 3000);
      pollStatus();
      timeoutId = setTimeout(() => {
        setWaitingLong(true);
        setLoading(false); // Give up loading and show current status
      }, 30000); // 30 seconds
    });
    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
    };
  }, [orderId, profile, amountStr, product, category]);
  if (loading) {
    return <div className="min-h-screen bg-purple-50/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7c3aed]"></div>
          <p className="text-gray-500 font-medium text-sm">Confirming your payment status...</p>
        </div>
      </div>;
  }
  const isConfirmed = status === 'PLACED' || status === 'PAID';
  return <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/50 flex items-center justify-center p-4">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center border border-purple-100">
          <div className="flex justify-center mb-6">
            {isConfirmed ? <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }} className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
              </motion.div> : <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border border-amber-100">
                <Clock className="w-10 h-10" />
              </motion.div>}
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {isConfirmed ? 'Order Placed!' : 'Payment Pending...'}
          </h1>
          <p className="text-gray-500 mb-8 font-medium">
            {isConfirmed ? 'Your order has been recorded successfully.' : 'We are waiting for payment confirmation from UroPay.'}
          </p>

          <div className="bg-purple-50/25 rounded-2xl p-6 text-left mb-8 border border-purple-100/30">
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="text-gray-900 font-mono text-xs">{orderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Product</span>
                <span className="text-gray-900">{product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="text-gray-900 capitalize">{category}</span>
              </div>
              
              <div className="h-px bg-gray-100 my-4"></div>
              
              <div className="flex justify-between items-center font-bold">
                <span className="text-gray-900">Amount Paid</span>
                <span className="text-xl text-[#7c3aed]">₹{amountStr}</span>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500 text-xs">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border uppercase ${isConfirmed ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  {status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={() => navigate('/my-orders')} className="w-full bg-[#7c3aed] hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-200 cursor-pointer">
              View My Orders
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button onClick={() => navigate('/shopping')} className="w-full bg-white hover:bg-purple-50 text-[#7c3aed] font-bold py-3.5 px-4 rounded-full transition-colors flex items-center justify-center gap-2 border-2 border-purple-100 cursor-pointer">
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </motion.div>
    </div>;
}