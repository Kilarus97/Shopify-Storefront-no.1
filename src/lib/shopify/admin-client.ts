import { SHOPIFY_STORE_DOMAIN } from '@/lib/constants';
import { ADMIN_API_VERSION } from '@/lib/constants';

interface AdminFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
}

export async function shopifyAdminFetch<T>({
  query,
  variables,
}: AdminFetchOptions): Promise<{ data: T }> {
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN;
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`;

  console.log('📡 Admin API call:', endpoint);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token || '',
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await response.text();
  console.log('📡 Admin API raw response:', text.substring(0, 500));

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Admin API error: ${response.status}`);
  }

  if (json.errors) {
    console.error('❌ Admin GraphQL errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'Admin GraphQL error');
  }

  return json as { data: T };
}