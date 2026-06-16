'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/cart-context';
import { Button } from '@/components/ui/button';
import { Price } from '@/components/ui/price';

export function CartDrawer() {
  const { cart, removeItem, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Listen for cart open events
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-cart', handler);
    return () => window.removeEventListener('open-cart', handler);
  }, []);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Cart ({cart.totalQuantity})
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-secondary-400 hover:text-secondary-600"
              aria-label="Close cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-secondary-300 mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <p className="text-secondary-500">Your cart is empty</p>
                <Link
                  href="/collections"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Continue shopping →
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    {/* Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary-100">
                      {item.image ? (
                        <Image
                          src={item.image.url}
                          alt={item.image.altText || item.title}
                          fill
                          sizes="80px"
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
                        <Link
                          href={`/products/${item.handle}`}
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-medium text-secondary-900 hover:text-primary-600 line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-secondary-400 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {item.variantTitle && item.variantTitle !== 'Default Title' && (
                        <p className="text-xs text-secondary-400 mt-0.5">{item.variantTitle}</p>
                      )}

                      <div className="mt-auto flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded border border-secondary-300 text-secondary-600 hover:bg-secondary-50"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded border border-secondary-300 text-secondary-600 hover:bg-secondary-50"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <Price
                          price={{ amount: item.price.toString(), currencyCode: 'USD' }}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t border-secondary-200 px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-500">Subtotal</span>
                <Price
                  price={{ amount: cart.totalPrice.toFixed(2), currencyCode: 'USD' }}
                  className="text-lg font-semibold"
                />
              </div>
              <p className="text-xs text-secondary-400">
                Shipping and taxes calculated at checkout.
              </p>
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <Button className="w-full" size="lg">
                  View Cart
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Helper to open cart from anywhere
export function openCart() {
  window.dispatchEvent(new CustomEvent('open-cart'));
}