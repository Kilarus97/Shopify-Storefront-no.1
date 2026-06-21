'use client';

import { useWishlist } from '@/lib/context/wishlist-context';
import { WishlistButton } from './wishlist-button';
import type { Product, ProductVariant } from '@/lib/types';

interface WishlistButtonWrapperProps {
  product: Product;
  variant?: ProductVariant;
}

export function WishlistButtonWrapper({ product, variant }: WishlistButtonWrapperProps) {
  const { toggleItem, isInWishlist, isLoggedIn } = useWishlist();
  const selectedVariant = variant || product.variants?.[0];

  if (!selectedVariant || !isLoggedIn) return null;

  const productId = product.id;
  const isInList = isInWishlist(productId);

  const handleToggle = () => {
    toggleItem(productId, {
      id: `${productId}-${selectedVariant.id}`,
      productId: productId,
      variantId: selectedVariant.id,
      title: product.title,
      handle: product.handle,
      price: selectedVariant.price.amount,
      currencyCode: selectedVariant.price.currencyCode,
      image: product.featuredImage || null,
      availableForSale: selectedVariant.availableForSale,
    });
  };

  return (
    <WishlistButton
      isInWishlist={isInList}
      onToggle={handleToggle}
    />
  );
}