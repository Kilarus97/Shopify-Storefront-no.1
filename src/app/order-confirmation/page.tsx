// src/app/order-confirmation/page.tsx
import { Suspense } from 'react';
import OrderConfirmation from './order-confirmation-content';

export const dynamic = 'force-dynamic';

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto mt-20 text-center p-8">
      <div className="animate-spin text-4xl mb-4">⏳</div>
      <h1 className="text-2xl font-bold mb-2">Učitavanje...</h1>
    </div>}>
      <OrderConfirmation />
    </Suspense>
  );
}