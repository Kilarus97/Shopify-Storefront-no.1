'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/cart-context';
import { Button } from '@/components/ui/button';
import { Price } from '@/components/ui/price';

export function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        <h1 className="heading-md text-secondary-900 mb-4">Your Cart</h1>
        <p className="text-secondary-500 mb-6">Your cart is empty.</p>
        <Link href="/collections">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="heading-md text-secondary-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-lg border border-secondary-200 p-4"
            >
              {/* Image */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-secondary-100">
                {item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-secondary-300">
                    No img
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <Link
                      href={`/products/${item.handle}`}
                      className="text-sm font-medium text-secondary-900 hover:text-primary-600"
                    >
                      {item.title}
                    </Link>
                    {item.variantTitle && item.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-secondary-400">{item.variantTitle}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-secondary-400 hover:text-red-500"
                    aria-label="Remove"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-secondary-300 text-secondary-600 hover:bg-secondary-50"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-secondary-300 text-secondary-600 hover:bg-secondary-50"
                    >
                      +
                    </button>
                  </div>

                  <Price
                    price={{ amount: (item.price * item.quantity).toFixed(2), currencyCode: 'USD' }}
                    className="text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-secondary-400 hover:text-red-500 transition-colors"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-secondary-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Summary</h2>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-secondary-500">Subtotal ({cart.totalQuantity} items)</dt>
                <dd className="text-secondary-900">
                  <Price price={{ amount: cart.totalPrice.toFixed(2), currencyCode: 'USD' }} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-500">Shipping</dt>
                <dd className="text-secondary-400">Calculated at checkout</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-500">Tax</dt>
                <dd className="text-secondary-400">Calculated at checkout</dd>
              </div>
            </dl>

            <div className="my-4 border-t border-secondary-200" />

            <div className="flex justify-between mb-6">
              <span className="text-base font-semibold text-secondary-900">Estimated Total</span>
              <Price
                price={{ amount: cart.totalPrice.toFixed(2), currencyCode: 'USD' }}
                className="text-lg font-semibold"
              />
            </div>

            <Link href="/checkout">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>

            <Link href="/collections" className="mt-3 block text-center text-sm text-primary-600 hover:text-primary-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}