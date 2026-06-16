'use server';

import { shopifyFetch } from './client';
import type { Cart as CartType } from '@/lib/types/cart';
import type { ShippingAddress } from '@/lib/types/checkout';
import { NEXT_PUBLIC_STORE_URL, SHOPIFY_STORE_PASSWORD, SHOPIFY_STORE_DOMAIN } from '@/lib/constants';

export async function createCart(
  cart: CartType,
  shippingAddress: ShippingAddress,
  email: string
): Promise<{ success: boolean; checkoutUrl?: string; errors: string[] }> {
  const lines = cart.items.map((item) => ({
    merchandiseId: item.variantId,
    quantity: item.quantity,
  }));

  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          message
          field
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: Array<{ message: string; field: string[] }>;
    };
  }>({
    query: mutation,
    variables: {
      input: {
        lines,
        buyerIdentity: {
          email,
          deliveryAddressPreferences: [{
            deliveryAddress: {
              firstName: shippingAddress.firstName,
              lastName: shippingAddress.lastName,
              address1: shippingAddress.address1,
              address2: shippingAddress.address2 || '',
              city: shippingAddress.city,
              province: shippingAddress.province,
              zip: shippingAddress.zip,
              country: shippingAddress.country,
              phone: shippingAddress.phone || '',
            }
          }]
        }
      }
    },
  });

  if (data.cartCreate.userErrors.length > 0) {
    return {
      success: false,
      errors: data.cartCreate.userErrors.map((e) => e.message),
    };
  }

  if (!data.cartCreate.cart?.checkoutUrl) {
    return { success: false, errors: ['No checkout URL returned'] };
  }
  
  // ✅ Direktan checkout URL + return_to
  const checkoutUrl = new URL(data.cartCreate.cart.checkoutUrl);
  checkoutUrl.searchParams.set('return_to', `${NEXT_PUBLIC_STORE_URL}/order-confirmation`);
  
  return {
    success: true,
    checkoutUrl: checkoutUrl.toString(),
    errors: [],
  };
  
}