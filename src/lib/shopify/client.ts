import {
    SHOPIFY_GRAPHQL_ENDPOINT,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  } from '@/lib/constants';
  
  interface ShopifyFetchOptions {
    query: string;
    variables?: Record<string, unknown>;
    cache?: RequestCache;
    revalidate?: number;
    tags?: string[];
  }
  
  interface ShopifyFetchResult<T> {
    data: T;
    errors?: Array<{ message: string }>;
  }
  
  export async function shopifyFetch<T>({
    query,
    variables,
    cache = 'no-store',
    revalidate,
    tags,
  }: ShopifyFetchOptions): Promise<ShopifyFetchResult<T>> {
    const response = await fetch(SHOPIFY_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      ...(revalidate || tags
        ? { next: { ...(revalidate ? { revalidate } : {}), ...(tags ? { tags } : {}) } }
        : {}),
    });
  
    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }
  
    const json = await response.json();
  
    if (json.errors) {
      console.error('Shopify GraphQL errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL error');
    }
  
    return json as ShopifyFetchResult<T>;
  }
  
  export async function shopifyFetchStatic<T>(
    query: string,
    variables?: Record<string, unknown>,
    revalidate = 300,
    tags?: string[]
  ): Promise<ShopifyFetchResult<T>> {
    return shopifyFetch<T>({
      query,
      variables,
      cache: 'force-cache',
      revalidate,
      tags,
    });
  }