// src/app/api/wishlist/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/lib/shopify/product';

export async function POST(request: NextRequest) {
  const { ids } = await request.json();
  
  const products = [];
  for (const gid of ids) {
    const productId = gid.replace('gid://shopify/Product/', '');
    try {
      const product = await getProduct(productId);
      if (product) {
        const variant = product.variants?.[0];
        products.push({
          id: gid,
          productId: product.id,
          variantId: variant?.id || '',
          title: product.title,
          handle: product.handle,
          price: variant?.price.amount || '0',
          currencyCode: variant?.price.currencyCode || 'USD',
          image: product.featuredImage || null,
          availableForSale: variant?.availableForSale || false,
        });
      }
    } catch {
      // preskoči
    }
  }
  
  return NextResponse.json(products);
}
