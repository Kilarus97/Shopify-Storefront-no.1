'use server';

import { shopifyFetch } from './client';
import type { Cart } from '@/lib/types/cart';
import type { ShippingAddress } from '@/lib/types/checkout';

export interface CheckoutResponse {
  checkout: {
    id: string;
    webUrl: string;
    totalPrice: { amount: string; currencyCode: string };
    subtotalPrice: { amount: string; currencyCode: string };
    totalTax: { amount: string; currencyCode: string };
    shippingAddress: ShippingAddress | null;
    shippingLine: {
      title: string;
      price: { amount: string; currencyCode: string };
    } | null;
    lineItems: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          quantity: number;
          variant: {
            price: { amount: string; currencyCode: string };
            image: { url: string; altText: string | null } | null;
          } | null;
        };
      }>;
    };
  } | null;
  checkoutUserErrors: Array<{ message: string; code: string }>;
}

export async function createCheckout(
    cart: Cart
  ): Promise<{ success: boolean; checkoutUrl?: string; errors: string[] }> {
    const lines = cart.items.map((item) => ({
      merchandiseId: item.id,
      quantity: item.quantity,
    }));
  
    const mutation = `
      mutation cartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            message
            code
          }
        }
      }
    `;
  
    const { data } = await shopifyFetch<{
      cartCreate: {
        cart: { id: string; checkoutUrl: string } | null;
        userErrors: Array<{ message: string; code: string }>;
      };
    }>({
      query: mutation,
      variables: { lines },
    });
  
    console.log('🔍 Cart create response:', JSON.stringify(data, null, 2));
  
    if (data.cartCreate.userErrors.length > 0) {
      return {
        success: false,
        errors: data.cartCreate.userErrors.map((e) => e.message),
      };
    }
  
    return {
      success: true,
      checkoutUrl: data.cartCreate.cart?.checkoutUrl,
      errors: [],
    };
  }

export async function updateShippingAddress(
  checkoutId: string,
  address: ShippingAddress
): Promise<{ success: boolean; errors: string[] }> {
  const mutation = `
    mutation checkoutShippingAddressUpdateV2($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
      checkoutShippingAddressUpdateV2(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
        checkout {
          id
          shippingAddress {
            firstName lastName address1 address2 city province zip country phone
          }
        }
        checkoutUserErrors {
          message
          code
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    checkoutShippingAddressUpdateV2: CheckoutResponse;
  }>({
    query: mutation,
    variables: { checkoutId, shippingAddress: address },
  });

  if (data.checkoutShippingAddressUpdateV2.checkoutUserErrors.length > 0) {
    return {
      success: false,
      errors: data.checkoutShippingAddressUpdateV2.checkoutUserErrors.map((e) => e.message),
    };
  }

  return { success: true, errors: [] };
}

export async function getShippingRates(checkoutId: string): Promise<{
    success: boolean;
    rates: Array<{ id: string; title: string; price: { amount: string; currencyCode: string } }>;
    errors: string[];
  }> {
    const query = `
      query getCheckout($checkoutId: ID!) {
        node(id: $checkoutId) {
          ... on Checkout {
            availableShippingRates {
              shippingRates {
                handle
                title
                price { amount currencyCode }
              }
            }
          }
        }
      }
    `;
  
    const { data } = await shopifyFetch<{
      node: {
        availableShippingRates: {
          shippingRates: Array<{
            handle: string;
            title: string;
            price: { amount: string; currencyCode: string };
          }>;
        } | null;
      };
    }>({ query, variables: { checkoutId } });
  
    const rates = data.node?.availableShippingRates?.shippingRates || [];
  

    return {
      success: true,
      rates: rates.map((r) => ({
        id: r.handle,
        title: r.title,
        price: r.price,
      })),
      errors: [],
    };
  }