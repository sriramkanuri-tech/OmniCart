import React, { useEffect, useState } from 'react';
import { createOrder } from '../services/api';
import { useGlobalState } from '../hooks/useGlobalState';

interface UroPayButtonProps {
  productName: string;
  amount: number;
  productId: string;
  category?: string;
}

export default function UroPayButton({ productName, amount, productId, category = 'Shopping' }: UroPayButtonProps) {
  const { profile } = useGlobalState();
  const [orderId] = useState(() => `${category.replace(/[^a-zA-Z0-9]/g, '')}_${productId}_${Date.now()}`);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    const initOrderOnBackend = async () => {
      // Don't create twice, and wait until we have a logged in user email
      if (!profile?.email || created) return;

      try {
        console.log(`[UroPayButton] Pre-creating pending order ${orderId} on backend before payment starts.`);
        await createOrder({
          productId,
          productName,
          amount,
          category,
          userId: profile.email,
          userEmail: profile.email,
          userName: profile.name || profile.email.split('@')[0]
        });
        setCreated(true);
      } catch (err) {
        console.error('[UroPayButton] Failed to pre-create pending order:', err);
      }
    };

    initOrderOnBackend();
  }, [profile, orderId, created, productName, amount, productId, category]);

  useEffect(() => {
    // Re-initialize the widget if UroPay exists
    // @ts-ignore
    if (window.UroPay && typeof window.UroPay.init === 'function') {
      // @ts-ignore
      window.UroPay.init();
    }
  }, [amount, productId, productName, category]);

  const successUrl = `https://omnicart-992111359826.us-west1.run.app/payment-success?orderId=${orderId}&product=${encodeURIComponent(productName)}&amount=${amount}&category=${encodeURIComponent(category)}`;
  const failureUrl = `https://omnicart-992111359826.us-west1.run.app/payment-failed?orderId=${orderId}&product=${encodeURIComponent(productName)}&amount=${amount}&category=${encodeURIComponent(category)}`;

  return (
    <a 
      href="#" 
      className="uropay-btn font-bold text-sm" 
      data-uropay-api-key="5GNRS1IZYM2R54U8QIC52XB2GPN511UM" 
      data-uropay-button-id="JULIET633209" 
      data-uropay-environment="LIVE" 
      data-uropay-amount={amount} 
      data-uropay-success-redirect-url={successUrl} 
      data-uropay-failure-redirect-url={failureUrl}
      style={{
        display: 'flex',
        width: '100%',
        height: '3.5rem', // h-14
        backgroundColor: '#7c3aed', // OmniCart purple
        color: '#ffffff',
        borderRadius: '1rem', // rounded-2xl
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        boxShadow: '0 20px 25px -5px rgba(124, 58, 237, 0.1), 0 8px 10px -6px rgba(124, 58, 237, 0.1)',
        transition: 'all 0.15s ease'
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      Pay with UroPay
    </a>
  );
}
