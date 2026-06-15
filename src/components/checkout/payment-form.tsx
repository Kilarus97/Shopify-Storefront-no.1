'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { PaymentMethod } from '@/lib/types/checkout';

interface PaymentFormProps {
  onSubmit: (method: PaymentMethod) => void;
  onBack: () => void;
  isPending: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'credit_card', title: 'Credit Card', description: 'Visa, Mastercard, Amex' },
  { id: 'paypal', title: 'PayPal', description: 'Pay with your PayPal account' },
  { id: 'cod', title: 'Cash on Delivery', description: 'Pay when you receive your order' },
];

export function PaymentForm({ onSubmit, onBack, isPending }: PaymentFormProps) {
  const [selected, setSelected] = useState<PaymentMethod | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) onSubmit(selected);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-secondary-900">Payment Method</h2>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => setSelected(method)}
            className={`w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
              selected?.id === method.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-secondary-300'
            }`}
          >
            <div>
              <p className="text-sm font-medium text-secondary-900">{method.title}</p>
              <p className="text-xs text-secondary-500">{method.description}</p>
            </div>
            <div
              className={`h-5 w-5 rounded-full border-2 ${
                selected?.id === method.id
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-secondary-300'
              }`}
            >
              {selected?.id === method.id && (
                <div className="h-full w-full rounded-full bg-white scale-[0.4]" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1" size="lg" disabled={!selected || isPending}>
          {isPending ? 'Processing...' : 'Review Order'}
        </Button>
      </div>
    </form>
  );
}