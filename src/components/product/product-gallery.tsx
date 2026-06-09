'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ShopifyImage } from '@/lib/types';

interface ProductGalleryProps {
  images: ShopifyImage[];
  productTitle: string;
}

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = images[selectedIndex];

  if (!images.length) {
    return (
      <div className="aspect-square bg-secondary-100 rounded-lg flex items-center justify-center text-secondary-400">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary-100">
        {currentImage && (
          <Image
            src={currentImage.url}
            alt={currentImage.altText || productTitle}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors',
                selectedIndex === index
                  ? 'border-primary-500'
                  : 'border-transparent hover:border-secondary-300'
              )}
            >
              <Image
                src={image.url}
                alt={image.altText || `${productTitle} ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}