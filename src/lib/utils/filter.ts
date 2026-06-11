import type { Product } from '@/lib/types';

interface FilterParams {
  colors?: string[];
  sizes?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
}

export function filterProducts(products: Product[], filters: FilterParams): Product[] {
  return products.filter((product) => {
    const variant = product.variants?.[0];
    if (!variant) return false;

    // Price filter
    const price = parseFloat(variant.price?.amount || '0');
    if (filters.priceMin !== undefined && price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && price > filters.priceMax) return false;

    // Availability filter
    if (filters.inStock && !variant.availableForSale) return false;

    // Color filter (check variant options or tags)
    if (filters.colors && filters.colors.length > 0) {
      const productColors = product.variants?.flatMap((v) =>
        v.selectedOptions?.filter((o) => o.name.toLowerCase() === 'color').map((o) => o.value.toLowerCase()) || []
      ) || [];
      const productTags = product.tags?.map((t) => t.toLowerCase()) || [];
      const hasMatchingColor = filters.colors.some((c) => {
        const lower = c.toLowerCase();
        return productColors.some((pc) => pc.includes(lower)) || productTags.some((pt) => pt.includes(lower));
      });
      if (!hasMatchingColor) return false;
    }

    // Size filter (check variant options)
    if (filters.sizes && filters.sizes.length > 0) {
      const productSizes = product.variants?.flatMap((v) =>
        v.selectedOptions?.filter((o) => o.name.toLowerCase() === 'size').map((o) => o.value.toLowerCase()) || []
      ) || [];
      const hasMatchingSize = filters.sizes.some((s) => {
        const lower = s.toLowerCase();
        return productSizes.some((ps) => ps === lower);
      });
      if (!hasMatchingSize) return false;
    }

    return true;
  });
}