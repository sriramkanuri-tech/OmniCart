import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ShoppingBag, RotateCcw, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  return <div className="min-h-screen bg-gradient-to-b from-white to-red-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Subtle falling dots */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => <div key={i} className="absolute bg-red-400 rounded-full w-2 h-2" style={{
        left: `${Math.random() * 100}vw`,
        top: `-${Math.random() * 20}vh`,
        animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
        animationDelay: `${Math.random() * 5}s`
      }} />)}
      </div>
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(120vh);
          }
        }
      `}</style>

      <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center border border-red-100">
          <div className="flex justify-center mb-6">
            <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            type: "spring",
            stiffness: 400,
            damping: 10
          }}>
              <XCircle className="w-24 h-24 text-red-500 animate-[pulse_2s_ease-in-out_infinite]" strokeWidth={1.5} />
            </motion.div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-500 mb-8">No money was deducted from your account.</p>

          <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-medium text-gray-900">{orderId || 'UNKNOWN'}</span>
              </div>
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="flex justify-between items-center font-bold">
                <span className="text-gray-900">Attempted Amount</span>
                <span className="text-xl text-gray-900">₹{amount || '0'}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500 text-sm">Status</span>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  FAILED
                </span>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded-xl">
                 <p className="text-xs text-red-800">
                   <strong>Reason:</strong> Payment could not be completed at the gateway level.
                 </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={() => navigate(-1)} className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3.5 px-4 rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200">
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button onClick={() => navigate('/shopping')} className="w-full bg-white hover:bg-red-50 text-red-700 font-medium py-3.5 px-4 rounded-full transition-colors flex items-center justify-center gap-2 border-2 border-red-100">
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </button>
            <button onClick={() => window.open('https://wa.me/919948746315', '_blank')} className="w-full bg-transparent hover:bg-gray-50 text-gray-600 font-medium py-2 px-4 rounded-full transition-colors flex items-center justify-center gap-2 text-sm mt-4">
              <MessageSquare className="w-4 h-4" />
              Contact Support
            </button>
          </div>
        </div>
      </motion.div>
    </div>;
}