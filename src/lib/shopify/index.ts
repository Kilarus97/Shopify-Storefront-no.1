import { shopifyFetchStatic } from './client';
import {
  PRODUCTS_PER_PAGE,
  COLLECTIONS_PER_PAGE,
  REVALIDATE_INTERVAL,
} from '@/lib/constants';
import type { Product, Collection, PageInfo } from '@/lib/types';


export async function getHomePageData() {
  const query = `
    query getHomePageData {
      featured: products(first: 8, query: "tag:featured") {
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
      latest: products(first: 8, sortKey: CREATED_AT, reverse: true) {
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
      collections(first: 3) {
        edges {
          node {
            id handle title description
            image { id url altText width height }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetchStatic<{
    featured: { edges: Array<{ node: Product }> };
    latest: { edges: Array<{ node: Product }> };
    collections: { edges: Array<{ node: Collection }> };
  }>(query, {}, REVALIDATE_INTERVAL.HOME, ['home']);

  return {
    featured: data.featured.edges.map((e) => e.node),
    latest: data.latest.edges.map((e) => e.node),
    collections: data.collections.edges.map((e) => e.node),
  };
}

// ─── Collections (FR-06/07) ───

export async function getCollections({
  first = COLLECTIONS_PER_PAGE,
  after,
}: {
  first?: number;
  after?: string;
} = {}): Promise<{ collections: Collection[]; pageInfo: PageInfo }> {
  const query = `
    query getCollections($first: Int!, $after: String) {
      collections(first: $first, after: $after) {
        edges { node { id handle title description image { id url altText width height } seo { title description } updatedAt } cursor }
        pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
      }
    }
  `;

  const { data } = await shopifyFetchStatic<{
    collections: { edges: Array<{ node: Collection; cursor: string }>; pageInfo: PageInfo };
  }>(query, { first, after }, REVALIDATE_INTERVAL.COLLECTION, ['collections']);

  return {
    collections: data.collections.edges.map((e) => e.node),
    pageInfo: data.collections.pageInfo,
  };
}