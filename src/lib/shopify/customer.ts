import { shopifyFetch } from './client';
import type { UpdateCustomerInput, CustomerAddress } from '@/lib/types/customer';

const CUSTOMER_ACCESS_TOKEN = process.env.SHOPIFY_CUSTOMER_ACCESS_TOKEN || '';

export interface CustomerResponse {
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    defaultAddress: {
      id: string;
      firstName: string;
      lastName: string;
      address1: string;
      address2?: string;
      city: string;
      province: string;
      zip: string;
      country: string;
      phone?: string;
    } | null;
    addresses: {
      edges: Array<{
        node: {
          id: string;
          firstName: string;
          lastName: string;
          address1: string;
          address2?: string;
          city: string;
          province: string;
          zip: string;
          country: string;
          phone?: string;
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

export async function getCustomer(
  accessToken: string,
  ordersAfter?: string | null,
  ordersFirst: number = 5
): Promise<{
  customer: CustomerResponse['customer'] | null;
  ordersPageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}> {
  const query = `
    query getCustomer($customerAccessToken: String!, $ordersFirst: Int!, $ordersAfter: String) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
        defaultAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          zip
          country
          phone
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              address1
              address2
              city
              zip
              country
              phone
            }
          }
        }
        orders(first: $ordersFirst, after: $ordersAfter, sortKey: PROCESSED_AT, reverse: true) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
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

  const { data } = await shopifyFetch<{
    customer: CustomerResponse['customer'] & {
      orders: {
        pageInfo: {
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          startCursor: string | null;
          endCursor: string | null;
        };
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
    };
  }>({
    query,
    variables: {
      customerAccessToken: accessToken,
      ordersFirst,
      ordersAfter: ordersAfter || undefined,
    },
  });

  if (!data.customer) {
    return {
      customer: null,
      ordersPageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }

  return {
    customer: data.customer,
    ordersPageInfo: data.customer.orders.pageInfo,
  };
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


export async function updateCustomer(
  token: string,
  customer: UpdateCustomerInput
): Promise<{ success: boolean; errors: string[] }> {
  const mutation = `
    mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        customerUserErrors {
          message
          code
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    customerUpdate: {
      customer: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
      } | null;
      customerUserErrors: Array<{ message: string; code: string }>;
    };
  }>({
    query: mutation,
    variables: {
      customerAccessToken: token,
      customer,
    },
  });

  if (data.customerUpdate.customerUserErrors.length > 0) {
    return {
      success: false,
      errors: data.customerUpdate.customerUserErrors.map((e) => e.message),
    };
  }

  return { success: true, errors: [] };
}

export async function getCustomerAddresses(token: string): Promise<{
  success: boolean;
  addresses: CustomerAddress[];
  errors: string[];
}> {
  const query = `
    query getCustomerAddresses($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        defaultAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          countryCode
          phone
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              countryCode
              phone
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    customer: {
      defaultAddress: CustomerAddress | null;
      addresses: {
        edges: Array<{ node: CustomerAddress }>;
      };
    } | null;
  }>({
    query,
    variables: { customerAccessToken: token },
  });

  if (!data.customer) {
    return { success: false, errors: ['Customer not found'], addresses: [] };
  }

  const addresses = data.customer.addresses.edges.map(({ node }) => node);

  return { success: true, addresses, errors: [] };

}

// Dodaj na postojeći fajl

export async function updateCustomerAddress(
  token: string,
  addressId: string,
  address: Partial<{
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone: string;
  }>
): Promise<{ success: boolean; errors: string[] }> {
  const mutation = `
    mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        customerAddress {
          id
        }
        customerUserErrors {
          message
          code
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    customerAddressUpdate: {
      customerAddress: { id: string } | null;
      customerUserErrors: Array<{ message: string; code: string }>;
    };
  }>({
    query: mutation,
    variables: {
      customerAccessToken: token,
      id: addressId,
      address,
    },
  });

  if (data.customerAddressUpdate.customerUserErrors.length > 0) {
    return {
      success: false,
      errors: data.customerAddressUpdate.customerUserErrors.map((e) => e.message),
    };
  }

  return { success: true, errors: [] };
}

export async function deleteCustomerAddress(
  token: string,
  addressId: string
): Promise<{ success: boolean; errors: string[] }> {
  const mutation = `
    mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        deletedCustomerAddressId
        customerUserErrors {
          message
          code
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: Array<{ message: string; code: string }>;
    };
  }>({
    query: mutation,
    variables: {
      customerAccessToken: token,
      id: addressId,
    },
  });

  if (data.customerAddressDelete.customerUserErrors.length > 0) {
    return {
      success: false,
      errors: data.customerAddressDelete.customerUserErrors.map((e) => e.message),
    };
  }

  return { success: true, errors: [] };
}

export async function setDefaultAddress(
  token: string,
  addressId: string
): Promise<{ success: boolean; errors: string[] }> {
  const mutation = `
    mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
      customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
        customer {
          defaultAddress {
            id
          }
        }
        customerUserErrors {
          message
          code
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    customerDefaultAddressUpdate: {
      customer: { defaultAddress: { id: string } | null } | null;
      customerUserErrors: Array<{ message: string; code: string }>;
    };
  }>({
    query: mutation,
    variables: {
      customerAccessToken: token,
      addressId,
    },
  });

  if (data.customerDefaultAddressUpdate.customerUserErrors.length > 0) {
    return {
      success: false,
      errors: data.customerDefaultAddressUpdate.customerUserErrors.map((e) => e.message),
    };
  }

  return { success: true, errors: [] };
}

