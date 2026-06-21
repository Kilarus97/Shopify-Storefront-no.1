import { shopifyAdminFetch } from './admin-client';
import { shopifyFetch } from './client'; // ✅ Storefront API

const METAFIELD_NAMESPACE = 'custom';
const METAFIELD_KEY = 'wishlist';

// ✅ Korak 1: Dobavi email kroz Storefront API
async function getCustomerEmail(customerAccessToken: string): Promise<string> {
  const query = `
    query getCustomerEmail($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        email
      }
    }
  `;

  const { data } = await shopifyFetch<{
    customer: { email: string } | null;
  }>({
    query,
    variables: { customerAccessToken },
  });

  return data.customer?.email || '';
}

// ✅ Korak 2: Dobavi Admin ID po emailu
async function getCustomerIdByEmail(email: string): Promise<string> {
  const query = `
    query getCustomerByEmail($query: String!) {
      customers(first: 1, query: $query) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;

  const { data } = await shopifyAdminFetch<{
    customers: {
      edges: Array<{ node: { id: string } }>;
    };
  }>({
    query,
    variables: { query: `email:${email}` },
  });

  return data.customers.edges[0]?.node.id || '';
}

// ✅ Kombinirano
async function getCustomerId(customerAccessToken: string): Promise<string> {
  const email = await getCustomerEmail(customerAccessToken);
  if (!email) return '';
  return getCustomerIdByEmail(email);
}


// ✅ Čitanje wishlist-a kroz Admin API
export async function getCustomerWishlist(
  customerAccessToken: string
): Promise<string[]> {
  const customerId = await getCustomerId(customerAccessToken);
  if (!customerId) return [];

  const query = `
    query getCustomerMetafield($id: ID!, $namespace: String!, $key: String!) {
      customer(id: $id) {
        metafield(namespace: $namespace, key: $key) {
          value
        }
      }
    }
  `;

  const { data } = await shopifyAdminFetch<{
    customer: {
      metafield: { value: string } | null;
    } | null;
  }>({
    query,
    variables: {
      id: customerId,
      namespace: METAFIELD_NAMESPACE,
      key: METAFIELD_KEY,
    },
  });

  if (!data.customer?.metafield?.value) return [];

  try {
    const parsed = JSON.parse(data.customer.metafield.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ✅ Upis wishlist-a kroz Admin API
export async function updateCustomerWishlist(
  customerAccessToken: string,
  productIds: string[]
): Promise<{ success: boolean; errors: string[] }> {
  const customerId = await getCustomerId(customerAccessToken);
  if (!customerId) return { success: false, errors: ['Customer not found'] };

  const mutation = `
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data } = await shopifyAdminFetch<{
    metafieldsSet: {
      metafields: Array<{ id: string; value: string }> | null;
      userErrors: Array<{ field: string; message: string }>;
    };
  }>({
    query: mutation,
    variables: {
      metafields: [
        {
          namespace: METAFIELD_NAMESPACE,
          key: METAFIELD_KEY,
          ownerId: customerId,          // ✅ ownerId, ne owner
          type: 'list.product_reference',
          value: JSON.stringify(productIds),
        },
      ],
    },
  });

  if (data.metafieldsSet.userErrors.length > 0) {
    return {
      success: false,
      errors: data.metafieldsSet.userErrors.map((e) => e.message),
    };
  }

  return { success: true, errors: [] };
}

// ✅ Dodaj proizvod
export async function addToWishlist(
    customerAccessToken: string,
    productId: string
  ): Promise<{ success: boolean; errors: string[] }> {
    const email = await getCustomerEmail(customerAccessToken);
    console.log('📧 Customer email:', email);
  
    const customerId = await getCustomerId(customerAccessToken);
    console.log('👤 Customer ID:', customerId);
  
    const current = await getCustomerWishlist(customerAccessToken);
    console.log('📋 Current wishlist:', current);
  
    if (current.includes(productId)) return { success: true, errors: [] };
  
    const updated = [...current, productId];
    console.log('💾 Saving wishlist:', updated);
  
    const result = await updateCustomerWishlist(customerAccessToken, updated);
    console.log('✅ Save result:', result);
  
    return result;
  }
  

// ✅ Ukloni proizvod
export async function removeFromWishlist(
  customerAccessToken: string,
  productId: string
): Promise<{ success: boolean; errors: string[] }> {
  const current = await getCustomerWishlist(customerAccessToken);
  const updated = current.filter((id) => id !== productId);
  return updateCustomerWishlist(customerAccessToken, updated);
}
