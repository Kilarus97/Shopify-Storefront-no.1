import Image from 'next/image';
import Link from 'next/link';
import { Price } from '@/components/ui/price';
import type { Cart } from '@/lib/types/cart';

interface OrderSummaryProps {
  cart: Cart;
  shippingPrice: number;
}

export function OrderSummary({ cart, shippingPrice }: OrderSummaryProps) {
  const tax = cart.totalPrice * 0.08; // 8% tax (placeholder)
  const total = cart.totalPrice + shippingPrice + tax;

  return (
    <div className="rounded-lg border border-secondary-200 p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Summary</h2>

      {/* Items */}
      <div className="space-y-3 mb-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary-100">
              {item.image ? (
                <Image
                  src={item.image.url}
                  alt={item.image.altText || item.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-secondary-300">
                  No img
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.handle}`}
                className="text-sm font-medium text-secondary-900 hover:text-primary-600 line-clamp-1"
              >
                {item.title}
              </Link>
              {item.variantTitle && item.variantTitle !== 'Default Title' && (
                <p className="text-xs text-secondary-400">{item.variantTitle}</p>
              )}
              <p className="text-xs text-secondary-500">Qty: {item.quantity}</p>
            </div>
            <Price
              price={{ amount: (item.price * item.quantity).toFixed(2), currencyCode: 'USD' }}
              className="text-sm"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-secondary-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-secondary-500">Subtotal</span>
          <Price price={{ amount: cart.totalPrice.toFixed(2), currencyCode: 'USD' }} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary-500">Shipping</span>
          <span className="text-secondary-900">
            {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary-500">Tax (8%)</span>
          <Price price={{ amount: tax.toFixed(2), currencyCode: 'USD' }} />
        </div>
      </div>

      <div className="border-t border-secondary-200 mt-4 pt-4">
        <div className="flex justify-between">
          <span className="text-base font-semibold text-secondary-900">Total</span>
          <Price
            price={{ amount: total.toFixed(2), currencyCode: 'USD' }}
            className="text-lg font-semibold"
          />
        </div>
      </div>
    </div>
  );
}