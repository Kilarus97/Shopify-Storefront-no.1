import {
  SHOPIFY_GRAPHQL_ENDPOINT,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  SHOPIFY_STORE_PASSWORD,
} from '@/lib/constants';

interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
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
  revalidate,
  tags,
}: ShopifyFetchOptions): Promise<ShopifyFetchResult<T>> {
  const fetchOptions: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      'Shopify-Storefront-Private-Token': SHOPIFY_STORE_PASSWORD,
    },
    body: JSON.stringify({ query, variables }),

  };
  

  
  if (revalidate) {
    fetchOptions.next = { revalidate, ...(tags ? { tags } : {}) };
  }

  console.log('🔍 Fetching:', SHOPIFY_GRAPHQL_ENDPOINT);

  const response = await fetch(SHOPIFY_GRAPHQL_ENDPOINT, fetchOptions);

  // ← DODAJ OVO
  const text = await response.text();
  //console.log('📡 Shopify raw response:', text);

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error('📡 Failed to parse response as JSON');
    throw new Error(`Shopify API error: ${response.status}`);
  }

  if (json.errors) {
    console.error('❌ GraphQL errors:', json.errors);
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
    revalidate,
    tags,
  });
}