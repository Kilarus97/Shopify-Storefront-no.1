import { SHOPIFY_STORE_DOMAIN } from '@/lib/constants';
import { getAdminAccessToken } from './admin-token';

interface AdminFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
}

export async function shopifyAdminFetch<T>({
  query,
  variables,
}: AdminFetchOptions): Promise<{ data: T }> {
  const token = await getAdminAccessToken();
  

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error('📡 Admin API error:', text);
    throw new Error(`Admin API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error('❌ Admin GraphQL errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'Admin GraphQL error');
  }

  return json as { data: T };
}