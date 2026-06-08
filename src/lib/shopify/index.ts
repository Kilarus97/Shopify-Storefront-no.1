import { shopifyFetchStatic } from './client';
import type { Product, Collection, PageInfo } from '@/lib/types';

// ─── Test query — samo prvih 8 proizvoda ───

export async function getHomePageData() {
  const query = `
    query getHomePageData {
      products(first: 8) {
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
          node { id handle title description image { id url altText width height } }
        }
      }
    }
  `;

  const { data } = await shopifyFetchStatic<{
    products: { edges: Array<{ node: any }> };
    collections: { edges: Array<{ node: Collection }> };
  }>(query, {}, 60, ['home']);

  // ← RAZMOTAVAJ EDGES
  const products: Product[] = data.products.edges.map((e) => ({
    ...e.node,
    variants: e.node.variants.edges.map((ve: any) => ve.node),
  }));

  return {
    featured: products,
    latest: [],
    collections: data.collections.edges.map((e) => e.node),
  };
}

// ─── Collections ───

export async function getCollections({
  first = 12,
  after,
}: {
  first?: number;
  after?: string;
} = {}): Promise<{ collections: Collection[]; pageInfo: PageInfo }> {
  const query = `
    query getCollections($first: Int!, $after: String) {
      collections(first: $first, after: $after) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              id
              url
              altText
              width
              height
            }
            seo {
              title
              description
            }
            updatedAt
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

  const { data } = await shopifyFetchStatic<{
    collections: {
      edges: Array<{ node: Collection; cursor: string }>;
      pageInfo: PageInfo;
    };
  }>(query, { first, after }, 300, ['collections']);

  return {
    collections: data.collections.edges.map((e) => e.node),
    pageInfo: data.collections.pageInfo,
  };
}