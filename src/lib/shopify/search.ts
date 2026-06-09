import { shopifyFetch } from './client';
import type { Product, Collection } from '@/lib/types';

interface SearchFilters {
  query?: string;
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
}

interface SearchResult {
  products: Product[];
  collections: Collection[];
  totalResults: number;
}

function buildFilterString(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters.query) {
    parts.push(filters.query);
  }

  if (filters.inStock) {
    parts.push('available:true');
  }

  if (filters.colors?.length) {
    filters.colors.forEach((c) => {
      parts.push(`tag:${c.toLowerCase()}`);
    });
  }

  // NOTE: collection: filter NE radi u Storefront API-ju — izbrisano
  // NOTE: price: filter NE radi pouzdano u Storefront API-ju — izbrisano

  return parts.join(' ');
}

async function searchByCollections(filters: SearchFilters): Promise<SearchResult> {
  console.log('🔍 Searching by collections:', filters.categories);

  // Fetch products from each collection in parallel
  const results = await Promise.all(
    filters.categories!.map(async (handle) => {
      const gql = `
        query getCollectionProducts($handle: String!) {
          collection(handle: $handle) {
            id handle title description
            image { id url altText width height }
            products(first: 24) {
              edges {
                node {
                  id handle title vendor tags
                  featuredImage { id url altText width height }
                  variants(first: 10) {
                    edges {
                      node {
                        id title availableForSale
                        price { amount currencyCode }
                        compareAtPrice { amount currencyCode }
                        selectedOptions { name value }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const { data } = await shopifyFetch<{
        collection: Collection & { products: { edges: Array<{ node: any }> } };
      }>({ query: gql, variables: { handle } });

      return data.collection;
    })
  );

  // Deduplicate products by ID
  const seen = new Set<string>();
  const allProducts: Product[] = [];
  const allCollections: Collection[] = [];

  for (const collection of results) {
    if (!collection) continue;

    allCollections.push({
      id: collection.id,
      handle: collection.handle,
      title: collection.title,
      description: collection.description,
      descriptionHtml: '',
      image: collection.image,
      products: [],
      seo: { title: null, description: null },
      updatedAt: '',
    });

    for (const edge of collection.products?.edges || []) {
      if (!seen.has(edge.node.id)) {
        seen.add(edge.node.id);
        allProducts.push({
          ...edge.node,
          variants: edge.node.variants?.edges?.map((ve: any) => ve.node) || [],
        });
      }
    }
  }

  // Client-side filters (price, availability, color, size)
  let filteredProducts = allProducts;

  if (filters.inStock) {
    filteredProducts = filteredProducts.filter((p) => p.variants?.[0]?.availableForSale);
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    filteredProducts = filteredProducts.filter((p) => {
      const price = parseFloat(p.variants?.[0]?.price?.amount || '0');
      if (filters.priceMin !== undefined && price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && price > filters.priceMax) return false;
      return true;
    });
  }

  if (filters.colors?.length) {
    filteredProducts = filteredProducts.filter((p) =>
      p.variants?.some((v) =>
        v.selectedOptions?.some(
          (o) =>
            o.name.toLowerCase() === 'color' &&
            filters.colors!.some((c) => o.value.toLowerCase() === c.toLowerCase())
        )
      )
    );
  }

  if (filters.sizes?.length) {
    filteredProducts = filteredProducts.filter((p) =>
      p.variants?.some((v) =>
        v.selectedOptions?.some(
          (o) =>
            o.name.toLowerCase() === 'size' &&
            filters.sizes!.some((s) => o.value.toLowerCase() === s.toLowerCase())
        )
      )
    );
  }

  console.log('🔍 Products after filters:', filteredProducts.length);

  return {
    products: filteredProducts,
    collections: allCollections,
    totalResults: filteredProducts.length + allCollections.length,
  };
}

async function searchByQuery(filters: SearchFilters): Promise<SearchResult> {
  const filterString = buildFilterString(filters);

  console.log('🔍 Search filter string:', filterString);

  const gql = `
    query searchProducts($query: String) {
      products(first: 24, query: $query) {
        edges {
          node {
            id handle title vendor tags
            featuredImage { id url altText width height }
            variants(first: 10) {
              edges {
                node {
                  id title availableForSale
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                  selectedOptions { name value }
                }
              }
            }
          }
        }
      }
      collections(first: 10) {
        edges {
          node { id handle title description image { id url altText width height } }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    products: { edges: Array<{ node: any }> };
    collections: { edges: Array<{ node: Collection }> };
  }>({ query: gql, variables: { query: filterString || null } });

  const allProducts: Product[] = data.products.edges.map((e) => ({
    ...e.node,
    variants: e.node.variants?.edges?.map((ve: any) => ve.node) || [],
  }));

  // Client-side filters
  let filteredProducts = allProducts;

  if (filters.inStock) {
    filteredProducts = filteredProducts.filter((p) => p.variants?.[0]?.availableForSale);
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    filteredProducts = filteredProducts.filter((p) => {
      const price = parseFloat(p.variants?.[0]?.price?.amount || '0');
      if (filters.priceMin !== undefined && price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && price > filters.priceMax) return false;
      return true;
    });
  }

  if (filters.colors?.length) {
    filteredProducts = filteredProducts.filter((p) =>
      p.variants?.some((v) =>
        v.selectedOptions?.some(
          (o) =>
            o.name.toLowerCase() === 'color' &&
            filters.colors!.some((c) => o.value.toLowerCase() === c.toLowerCase())
        )
      )
    );
  }

  if (filters.sizes?.length) {
    filteredProducts = filteredProducts.filter((p) =>
      p.variants?.some((v) =>
        v.selectedOptions?.some(
          (o) =>
            o.name.toLowerCase() === 'size' &&
            filters.sizes!.some((s) => o.value.toLowerCase() === s.toLowerCase())
        )
      )
    );
  }

  return {
    products: filteredProducts,
    collections: data.collections.edges.map((e) => e.node),
    totalResults: filteredProducts.length + data.collections.edges.length,
  };
}

export async function searchShopify(filters: SearchFilters): Promise<SearchResult> {
  // If categories selected → fetch from collections directly
  if (filters.categories?.length) {
    return searchByCollections(filters);
  }

  // Otherwise → normal product search
  return searchByQuery(filters);
}

export { type SearchFilters };