import { shopifyFetchStatic } from './client';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import type { Collection, Product } from '@/lib/types';

export async function getCollections(): Promise<Collection[]> {
  const query = `
    query getCollections {
      collections(first: 50) {
        edges {
          node {
            id handle title description descriptionHtml
            image { id url altText width height }
            seo { title description }
            updatedAt
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetchStatic<{
    collections: { edges: Array<{ node: Collection }> };
  }>(query, {}, REVALIDATE_INTERVAL.COLLECTION, ['collections']);

  return data.collections.edges.map((e) => e.node);
}

export async function getCollection(handle: string): Promise<Collection | null> {
  const query = `
    query getCollection($handle: String!) {
      collection(handle: $handle) {
        id handle title description descriptionHtml
        image { id url altText width height }
        seo { title description }
        updatedAt
        products(first: 24) {
          edges {
            node {
              id handle title vendor tags
              featuredImage { id url altText width height }
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
      }
    }
  `;

  const { data } = await shopifyFetchStatic<{
    collection: Collection & { products: { edges: Array<{ node: any }> } };
  }>(query, { handle }, REVALIDATE_INTERVAL.COLLECTION, ['collection', handle]);

  if (!data.collection) return null;

  return {
    ...data.collection,
    products: data.collection.products.edges.map((e) => ({
      ...e.node,
      variants: e.node.variants?.edges?.map((ve: any) => ve.node) || [],
    })),
  };
}