'use client';

import { Button } from '@/components/ui/button';
import type { Cart } from '@/lib/types/cart';
import type { ShippingAddress, ShippingOption, PaymentMethod } from '@/lib/types/checkout';

interface CheckoutReviewProps {
  cart: Cart;
  shippingAddress: ShippingAddress | null;
  shippingOption: ShippingOption | null;
  paymentMethod: PaymentMethod | null;
  note: string;
  onNoteChange: (note: string) => void;
  onPlaceOrder: () => void;
  onBack: () => void;
  isPending: boolean;
}

export function CheckoutReview({
  cart,
  shippingAddress,
  shippingOption,
  paymentMethod,
  note,
  onNoteChange,
  onPlaceOrder,
  onBack,
  isPending,
}: CheckoutReviewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-secondary-900">Review Your Order</h2>

      {/* Shipping */}
      {shippingAddress && (
        <div className="rounded-lg border border-secondary-200 p-4">
          <h3 className="text-sm font-medium text-secondary-900 mb-2">Shipping Address</h3>
          <p className="text-sm text-secondary-600">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          <p className="text-sm text-secondary-600">{shippingAddress.address1}</p>
          {shippingAddress.address2 && (
            <p className="text-sm text-secondary-600">{shippingAddress.address2}</p>
          )}
          <p className="text-sm text-secondary-600">
            {shippingAddress.city}, {shippingAddress.province} {shippingAddress.zip}
          </p>
          <p className="text-sm text-secondary-600">{shippingAddress.country}</p>
        </div>
      )}

      {/* Delivery */}
      {shippingOption && (
        <div className="rounded-lg border border-secondary-200 p-4">
          <h3 className="text-sm font-medium text-secondary-900 mb-2">Delivery Method</h3>
          <p className="text-sm text-secondary-600">{shippingOption.title}</p>
          <p className="text-xs text-secondary-400">{shippingOption.description}</p>
        </div>
      )}

      {/* Payment */}
      {paymentMethod && (
        <div className="rounded-lg border border-secondary-200 p-4">
          <h3 className="text-sm font-medium text-secondary-900 mb-2">Payment</h3>
          <p className="text-sm text-secondary-600">{paymentMethod.title}</p>
        </div>
      )}

      {/* Note */}
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-secondary-700 mb-1">
          Order Note (optional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
          placeholder="Special instructions for your order..."
        />
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          size="lg"
          onClick={onPlaceOrder}
          disabled={isPending}
        >
          {isPending ? 'Placing Order...' : `Place Order — $${(cart.totalPrice + (shippingOption?.price || 0) + cart.totalPrice * 0.08).toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}