import { shopifyFetch } from './client';
import type { Product, Collection } from '@/lib/types';

interface SearchResult {
  products: Product[];
  collections: Collection[];
  totalResults: number;
}

export async function searchShopify(query: string): Promise<SearchResult> {
  const gql = `
    query searchProducts($query: String!) {
      products(first: 24, query: $query) {
        edges {
          node {
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
      }
      collections(first: 10, query: $query) {
        edges {
          node { id handle title description image { id url altText width height } }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    products: { edges: Array<{ node: any }> };
    collections: { edges: Array<{ node: Collection }> };
  }>({ query: gql, variables: { query } });

  return {
    products: data.products.edges.map((e) => ({
      ...e.node,
      variants: e.node.variants.edges.map((ve: any) => ve.node),
    })),
    collections: data.collections.edges.map((e) => e.node),
    totalResults: data.products.edges.length + data.collections.edges.length,
  };
}