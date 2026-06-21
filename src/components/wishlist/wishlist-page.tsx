'use client';

import Link from 'next/link';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useCart } from '@/lib/context/cart-context';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/lib/types/cart';

export function WishlistPage() {
  const { items, removeItem, count, isLoading, isLoggedIn } = useWishlist();
  const { addItem: addToCart, isInCart } = useCart();

  const handleAddToCart = (item: (typeof items)[0]) => {
    const cartItem: CartItem = {
      id: item.variantId,
      variantId: item.variantId,
      productId: item.productId,
      title: item.title,
      handle: item.handle,
      variantTitle: 'Default',
      price: parseFloat(item.price),
      compareAtPrice: null,
      quantity: 1,
      image: item.image,
      availableForSale: item.availableForSale,
    };
    addToCart(cartItem);
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center py-16">
        <h2 className="heading-sm text-secondary-900 mb-2">Please log in</h2>
        <p className="text-secondary-500 mb-6">
          You need to be logged in to save and view your wishlist.
        </p>
        <Link
          href="/account/login"
          className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          Log In →
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-secondary-500">Loading your wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-secondary-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </div>
        <h2 className="heading-sm text-secondary-900 mb-2">Your wishlist is empty</h2>
        <p className="text-secondary-500 mb-6">
          Save items you love to your wishlist and find them easily later.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="heading-md text-secondary-900">My Wishlist</h1>
          <p className="text-sm text-secondary-500 mt-1">
            {count} item{count !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => {
          const inCart = isInCart(item.variantId);

          return (
            <div
              key={item.id}
              className="group rounded-lg border border-secondary-200 overflow-hidden hover:border-secondary-300 transition-colors"
            >
              <Link href={`/products/${item.handle}`} className="block relative aspect-square bg-secondary-50">
                {item.image ? (
                  <img
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75m-13.5 9h9" />
                    </svg>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeItem(item.productId);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-secondary-500 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="Remove from wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </Link>

              <div className="p-3">
                <Link href={`/products/${item.handle}`}>
                  <h3 className="text-sm font-medium text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-sm font-medium text-secondary-900 mt-1">
                  ${item.price} {item.currencyCode}
                </p>

                {!item.availableForSale && (
                  <p className="text-xs text-red-500 mt-1">Out of stock</p>
                )}

                <div className="mt-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.availableForSale}
                    className="w-full text-xs py-1.5"
                    size="sm"
                  >
                    {inCart ? 'Add More' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}