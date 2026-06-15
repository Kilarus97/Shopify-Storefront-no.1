'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/cart-context';
import { createOrder } from '@/lib/shopify/order';
import { ShippingForm } from './shipping-form';
import { ShippingOptions } from './shipping-options';
import { PaymentForm } from './payment-form';
import { OrderSummary } from './order-summary';
import { CheckoutReview } from './checkout-review';
import type { ShippingAddress, ShippingOption, PaymentMethod } from '@/lib/types/checkout';
import type { CustomerResponse } from '@/lib/shopify/customer';

interface CheckoutFormProps {
  customer: CustomerResponse['customer'] | null;
}

type CheckoutStep = 'shipping' | 'delivery' | 'payment' | 'review';

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: 'shipping', label: 'Shipping Address' },
  { key: 'delivery', label: 'Delivery Method' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

export function CheckoutForm({ customer }: CheckoutFormProps) {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [email, setEmail] = useState(customer?.email || '');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [note, setNote] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const handleShippingSubmit = useCallback(
    async (address: ShippingAddress, emailValue: string) => {
      setIsPending(true);
      setErrors([]);
      setShippingAddress(address);
      setEmail(emailValue);
  
      // Create order with Admin API
      const result = await createOrder(cart, address, emailValue, 0);
  
      if (!result.success) {
        setErrors(result.errors);
        setIsPending(false);
        return;
      }
  
      if (result.orderId) {
        setCheckoutUrl(`/checkout/confirmation?order=${result.orderId}&number=${result.orderNumber}`);
      }
  
      // Static shipping options
      setShippingOptions([
        { id: 'standard', title: 'Standard Shipping', description: '5-7 business days', price: 0 },
        { id: 'express', title: 'Express Shipping', description: '2-3 business days', price: 15 },
        { id: 'overnight', title: 'Overnight Shipping', description: 'Next business day', price: 30 },
      ]);
  
      setStep('delivery');
      setIsPending(false);
    },
    [cart]
  );

  const handleShippingOptionSelect = useCallback((option: ShippingOption) => {
    setSelectedShipping(option);
    setStep('payment');
  }, []);

  const handlePaymentSubmit = useCallback((method: PaymentMethod) => {
    setPaymentMethod(method);
    setStep('review');
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    setIsPending(true);
    setErrors([]);
  
    if (!shippingAddress) {
      setErrors(['Shipping address is required']);
      setIsPending(false);
      return;
    }
  
    const customerEmail = customer?.email || email;
  
    const result = await createOrder(
      cart,
      shippingAddress,
      customerEmail,
      selectedShipping?.price || 0
    );
  
    if (!result.success) {
      setErrors(result.errors);
      setIsPending(false);
      return;
    }
  
    clearCart();
    router.push(`/checkout/confirmation?order=${result.orderId}&number=${result.orderNumber}`);
    setIsPending(false);
  }, [router, clearCart, cart, shippingAddress, customer, email, selectedShipping]);

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-500 mb-4">Your cart is empty.</p>
        <button
          onClick={() => router.push('/collections')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Continue Shopping →
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Steps */}
      <div className="lg:col-span-2 space-y-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  i <= currentStepIndex
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-200 text-secondary-500'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm hidden sm:inline ${
                  i <= currentStepIndex ? 'text-secondary-900' : 'text-secondary-400'
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-8 ${i < currentStepIndex ? 'bg-primary-500' : 'bg-secondary-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        {/* Step content */}
        {step === 'shipping' && (
          <ShippingForm
            customer={customer}
            onSubmit={handleShippingSubmit}
            isPending={isPending}
          />
        )}

        {step === 'delivery' && (
          <ShippingOptions
            options={shippingOptions}
            selected={selectedShipping}
            onSelect={handleShippingOptionSelect}
            onBack={() => setStep('shipping')}
          />
        )}

        {step === 'payment' && (
          <PaymentForm
            onSubmit={handlePaymentSubmit}
            onBack={() => setStep('delivery')}
            isPending={isPending}
          />
        )}

        {step === 'review' && (
          <CheckoutReview
            cart={cart}
            shippingAddress={shippingAddress}
            shippingOption={selectedShipping}
            paymentMethod={paymentMethod}
            note={note}
            onNoteChange={setNote}
            onPlaceOrder={handlePlaceOrder}
            onBack={() => setStep('payment')}
            isPending={isPending}
          />
        )}
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-1">
        <OrderSummary
          cart={cart}
          shippingPrice={selectedShipping?.price || 0}
        />
      </div>
    </div>
  );
}