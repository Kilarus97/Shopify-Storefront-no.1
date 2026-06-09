'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  available: boolean;
  disabled?: boolean;
}

export function AddToCartButton({ available, disabled }: AddToCartButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    if (!available) return;

    setIsPending(true);
    // TODO: FR-09 — Cart functionality
    await new Promise((resolve) => setTimeout(resolve, 500)); // Placeholder
    setIsPending(false);
  };

  return (
    <Button
      size="lg"
      className="w-full"
      disabled={disabled || !available || isPending}
      onClick={handleClick}
    >
      {!available
        ? 'Sold Out'
        : isPending
        ? 'Adding...'
        : 'Add to Cart'}
    </Button>
  );
}