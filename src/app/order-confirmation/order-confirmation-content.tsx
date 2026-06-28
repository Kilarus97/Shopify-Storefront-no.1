'use client';


import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getLatestOrderByEmail } from '@/lib/shopify/check-order';
import { SHOPIFY_STORE_PASSWORD } from '@/lib/constants';

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email');

  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed'>('pending');
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
  if (paymentStatus === 'paid' && email) {
    // Pošalji invoice email
    fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        orderNumber: confirmedOrderNumber,
      }),
    }).catch(err => console.error('Email API error:', err));
  }
}, [paymentStatus, email, confirmedOrderNumber]);

  useEffect(() => {
    if (SHOPIFY_STORE_PASSWORD) {
      setShowPasswordModal(true);
    }
  }, []);

  const pollOrder = useCallback(async () => {
    if (!email) return;

    const result = await getLatestOrderByEmail(email);
    console.log('🔄 Polling email:', email, '→', result);

    if (result.found) {
      setPaymentStatus('paid');
      setConfirmedOrderNumber(result.orderNumber || null);
      setShowPasswordModal(false);
      return true; // found & paid
    }

    return false;
  }, [email]);

  useEffect(() => {
    if (!email) return;

    // Poll every 3 seconds
    const interval = setInterval(async () => {
      const done = await pollOrder();
      if (done) clearInterval(interval);
    }, 3000);

    // Timeout after 15 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPaymentStatus('failed');
    }, 15 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [email, pollOrder]);

  return (
    <div className="max-w-lg mx-auto mt-20 text-center p-8">
      {/* Password Modal */}
      {showPasswordModal && paymentStatus === 'pending' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-end">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Required</h3>
              <p className="text-sm text-gray-500 mb-4">
                If you are asked for a password on checkout, enter:
              </p>

              <div className="bg-gray-100 rounded-lg px-4 py-3 mb-4">
                <code className="text-lg font-mono font-bold text-gray-900 select-all">
                  sayffi
                </code>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Since the store is locked with a password for testing purposes, you will need to enter this password to complete the checkout process.
              </p>

              <div className="border-t border-gray-200 pt-4 mt-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Test Payment Card</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Card Number:</span>
                    <span className="font-mono font-medium text-gray-900 select-all">1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expiry:</span>
                    <span className="font-mono font-medium text-gray-900">12/30</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">CVC:</span>
                    <span className="font-mono font-medium text-gray-900">123</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cardholder:</span>
                    <span className="font-medium text-gray-900">John Doe</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-full mt-4 px-4 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentStatus === 'pending' && (
        <div>
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold mb-2">Čekamo potvrdu plaćanja...</h1>
          <p className="text-gray-600">
            Završite plaćanje u tabu koji se otvorio. Ova stranica će se automatski ažurirati.
          </p>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="mt-4 text-sm text-amber-600 hover:text-amber-700 underline"
          >
            🔒 Need the store password?
          </button>
        </div>
      )}

      {paymentStatus === 'paid' && (
        <div>
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Hvala na porudžbini!</h1>
          {confirmedOrderNumber && (
            <p className="text-gray-600">Broj porudžbine: <strong>{confirmedOrderNumber}</strong></p>
          )}
          <p className="text-gray-500 text-sm mt-2">You will receive a confirmation email shortly.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
          >
            Nazad na početnu
          </button>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div>
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Plaćanje nije potvrđeno</h1>
          <p className="text-gray-600">If you already paid, please contact us.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-gray-600 text-white rounded"
          >
            Nazad na početnu
          </button>
        </div>
      )}
    </div>
  );
}