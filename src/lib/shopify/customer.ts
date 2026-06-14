import { shopifyFetch } from './client';

const CUSTOMER_ACCESS_TOKEN = process.env.SHOPIFY_CUSTOMER_ACCESS_TOKEN || '';

interface CustomerResponse {
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    addresses: {
      edges: Array<{
        node: {
          id: string;
          address1: string;
          address2?: string;
          city: string;
          province: string;
          zip: string;
          country: string;
        };
      }>;
    };
    orders: {
      edges: Array<{
        node: {
          id: string;
          orderNumber: number;
          totalPrice: { amount: string; currencyCode: string };
          processedAt: string;
          fulfillmentStatus: string;
          lineItems: {
            edges: Array<{
              node: {
                title: string;
                quantity: number;
                variant: {
                  price: { amount: string; currencyCode: string };
                  image: { url: string; altText: string | null } | null;
                } | null;
              };
            }>;
          };
        };
      }>;
    };
  } | null;
  customerUserErrors: Array<{ message: string; code: string }>;
}

export async function createCustomer(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; errors: string[] }> {
  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          message
          code
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    customerCreate: CustomerResponse;
  }>({
    query: mutation,
    variables: {
      input: { email, password, firstName, lastName },
    },
  });

  if (data.customerCreate.customerUserErrors.length > 0) {
    return {
      success: false,
      errors: data.customerCreate.customerUserErrors.map((e) => e.message),
    };
  }

  return { success: true, errors: [] };
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; errors: string[] }> {
  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          message
          code
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: Array<{ message: string; code: string }>;
    };
  }>({
    query: mutation,
    variables: { input: { email, password } },
  });

  if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
    return {
      success: false,
      errors: data.customerAccessTokenCreate.customerUserErrors.map((e) => e.message),
    };
  }

  return {
    success: true,
    token: data.customerAccessTokenCreate.customerAccessToken?.accessToken,
    errors: [],
  };
}

export async function getCustomer(accessToken: string): Promise<CustomerResponse['customer'] | null> {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
        addresses(first: 10) {
          edges {
            node {
              id
              address1
              address2
              city
              province
              zip
              country
            }
          }
        }
        orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              totalPrice { amount currencyCode }
              processedAt
              fulfillmentStatus
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      price { amount currencyCode }
                      image { url altText }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{ customer: CustomerResponse['customer'] }>({
    query,
    variables: { customerAccessToken: accessToken },
  });

  return data.customer;
}

export async function logoutCustomer(accessToken: string): Promise<boolean> {
  const mutation = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        userErrors {
          message
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    customerAccessTokenDelete: { deletedAccessToken: string | null; userErrors: Array<{ message: string }> };
  }>({
    query: mutation,
    variables: { customerAccessToken: accessToken },
  });

  return data.customerAccessTokenDelete.deletedAccessToken !== null;
}