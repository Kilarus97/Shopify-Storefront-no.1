import { Price } from '@/components/ui/price';
import { Badge } from '@/components/ui/badge';
import type { Product, ProductVariant } from '@/lib/types';

interface ProductInfoProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
  const displayVariant = selectedVariant || product.variants?.[0];
  const isAvailable = displayVariant?.availableForSale ?? false;
  const isOnSale =
    displayVariant?.compareAtPrice &&
    parseFloat(displayVariant.compareAtPrice.amount) > parseFloat(displayVariant.price.amount);

  return (
    <div className="space-y-4">
      {/* Vendor */}
      {product.vendor && (
        <p className="text-sm text-secondary-500">{product.vendor}</p>
      )}

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900">
        {product.title}
      </h1>

      {/* Badges */}
      <div className="flex gap-2">
        {isOnSale && <Badge variant="sale">Sale</Badge>}
        {!isAvailable && <Badge variant="sold-out">Sold Out</Badge>}
      </div>

      {/* Price */}
      {displayVariant && (
        <Price
          price={displayVariant.price}
          compareAtPrice={displayVariant.compareAtPrice}
          className="text-xl"
        />
      )}

      {/* Description */}
      {product.descriptionHtml ? (
        <div
        className="prose prose-sm prose-p:text-secondary-600 prose-strong:text-secondary-900 prose-headings:text-secondary-900 prose-a:text-primary-600 prose-ul:list-disc prose-ol:list-decimal prose-li:text-secondary-600 max-w-none"
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
        ) : product.description ? (
        <p className="text-sm text-secondary-600">{product.description}</p>
        ) : null}
      {/* Tags */}
      {product.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded bg-secondary-100 px-2 py-0.5 text-xs text-secondary-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}