import Link from 'next/link';
import Image from 'next/image';
import { Price } from '@/components/ui/price';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants?.[0];
  const isAvailable = firstVariant?.availableForSale ?? false;
  const isNew = product.tags?.includes('new');
  const isOnSale =
    firstVariant?.compareAtPrice &&
    parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price.amount);

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-secondary-200 bg-white transition-shadow hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary-100">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-secondary-300">
            No image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && <Badge variant="new">New</Badge>}
          {isOnSale && <Badge variant="sale">Sale</Badge>}
          {!isAvailable && <Badge variant="sold-out">Sold Out</Badge>}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-sm font-medium text-secondary-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.title}
        </h3>
        {product.vendor && (
          <p className="text-xs text-secondary-400">{product.vendor}</p>
        )}
        {firstVariant && (
          <Price
            price={firstVariant.price}
            compareAtPrice={firstVariant.compareAtPrice}
            className="mt-1"
          />
        )}
      </div>
    </Link>
  );
}