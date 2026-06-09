import { ProductGrid } from './product-grid';
import type { Product } from '@/lib/types';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-secondary-200">
      <h2 className="text-xl font-heading font-semibold text-secondary-900 mb-6">
        You May Also Like
      </h2>
      <ProductGrid products={products} columns={4} />
    </section>
  );
}