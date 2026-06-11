import type { Product } from '@/lib/types';

export function sortProducts(products: Product[], sort: string): Product[] {
  const sorted = [...products];

  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.variants?.[0]?.price?.amount || '0');
        const priceB = parseFloat(b.variants?.[0]?.price?.amount || '0');
        return priceA - priceB;
      });

    case 'price_desc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.variants?.[0]?.price?.amount || '0');
        const priceB = parseFloat(b.variants?.[0]?.price?.amount || '0');
        return priceB - priceA;
      });

    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));

    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

    case 'featured':
    default:
      return sorted;
  }
}