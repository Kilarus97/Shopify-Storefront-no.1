import { shopifyFetchStatic } from './client';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import type { Product } from '@/lib/types';

export async function getProduct(handle: string): Promise<Product | null> {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id handle title vendor productType tags
        description descriptionHtml
        featuredImage { id url altText width height }
        images(first: 10) {
          edges { node { id url altText width height } }
        }
        variants(first: 20) {
          edges {
            node {
              id title availableForSale sku weight
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              selectedOptions { name value }
              image { id url altText width height }
            }
          }
        }
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        options { id name values }
        seo { title description }
        createdAt updatedAt
      }
    }
  `;

  const { data } = await shopifyFetchStatic<{
    product: any;  // ← koristi any za response, pa konvertuj
  }>(query, { handle }, REVALIDATE_INTERVAL.PRODUCT, ['product', handle]);

  if (!data.product) return null;

  // Unwrap edges iz GraphQL response-a
  return {
    ...data.product,
    images: data.product.images?.edges?.map((e: any) => e.node) || [],
    variants: data.product.variants?.edges?.map((e: any) => e.node) || [],
  };
}

export async function getRelatedProducts(
  productId: string,
  limit = 4
): Promise<Product[]> {
  const query = `
    query getRelatedProducts($productId: ID!) {
      productRecommendations(productId: $productId) {
        id handle title vendor tags
        featuredImage { id url altText width height }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 1) {
          edges {
            node {
              id title availableForSale
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetchStatic<{
    productRecommendations: any[];
  }>(query, { productId }, REVALIDATE_INTERVAL.PRODUCT, ['related']);

  return (data.productRecommendations || []).map((p) => ({
    ...p,
    variants: p.variants?.edges?.map((ve: any) => ve.node) || [],
  })).slice(0, limit);
}