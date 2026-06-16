'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { openCart } from './cart-drawer';
import type { Product, ProductVariant } from '@/lib/types';
import type { CartItem } from '@/lib/types/cart';
import { useCart } from '@/lib/context/cart-context';

interface AddToCartProps {
  product: Product;
  variant?: ProductVariant;
  quantity?: number;
  className?: string;
}

export function AddToCart({ product, variant, quantity = 1, className }: AddToCartProps) {
  const { addItem, isInCart } = useCart();
  const [isPending, setIsPending] = useState(false);

  const selectedVariant = variant || product.variants?.[0];
  const isAvailable = selectedVariant?.availableForSale ?? false;
  const inCart = selectedVariant ? isInCart(selectedVariant.id) : false;

  const handleAdd = async () => {
    if (!selectedVariant || !isAvailable) return;

    setIsPending(true);

    const cartItem: CartItem = {
      id: selectedVariant.id,       // za cart identifikaciju
      variantId: selectedVariant.id, // Shopify variant id
      productId: product.id,
      title: product.title,
      handle: product.handle,
      variantTitle: selectedVariant.title,
      price: parseFloat(selectedVariant.price.amount),
      compareAtPrice: selectedVariant.compareAtPrice
        ? parseFloat(selectedVariant.compareAtPrice.amount)
        : null,
      quantity,
      image: product.featuredImage,
      availableForSale: selectedVariant.availableForSale,
    };

    addItem(cartItem);
    openCart();

    setIsPending(false);
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={!isAvailable || isPending}
      className={className}
      size="lg"
    >
      {!isAvailable
        ? 'Sold Out'
        : isPending
        ? 'Adding...'
        : inCart
        ? 'Add More'
        : 'Add to Cart'}
    </Button>
  );
}