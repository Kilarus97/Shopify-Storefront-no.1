'use server';

import { shopifyAdminFetch } from './admin-client';
import type { Cart } from '@/lib/types/cart';
import type { ShippingAddress } from '@/lib/types/checkout';
import { sendOrderConfirmation } from '@/lib/email/send-order-confirmation';

export async function createOrder(
  cart: Cart,
  shippingAddress: ShippingAddress,
  email: string,
  shippingPrice: number
): Promise<{ success: boolean; orderId?: string; orderNumber?: number; errors: string[] }> {
  const mutation = `
    mutation orderCreate($order: OrderCreateOrderInput!) {
      orderCreate(order: $order) {
        order {
          id
          name
        }
        userErrors {
          message
          field
        }
      }
    }
  `;

  const { data } = await shopifyAdminFetch<{
    orderCreate: {
      order: {
        id: string;
        name: string;
      } | null;
      userErrors: Array<{ message: string; field: string[] }>;
    };
  }>({
    query: mutation,
    variables: {
      order: {
        lineItems: cart.items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        email,
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          address1: shippingAddress.address1,
          address2: shippingAddress.address2 || '',
          city: shippingAddress.city,
          province: shippingAddress.province,
          zip: shippingAddress.zip,
          countryCode: mapCountryToCode(shippingAddress.country),
          phone: shippingAddress.phone || '',
        },
        financialStatus: 'PENDING',
      },
    },
  });

  console.log('🔍 Order create response:', JSON.stringify(data, null, 2));

  // ✅ Proveri greške PRIVREME slanja email-a
  if (data.orderCreate.userErrors.length > 0) {
    return {
      success: false,
      errors: data.orderCreate.userErrors.map((e) => e.message),
    };
  }

  if (!data.orderCreate.order) {
    return { success: false, errors: ['Order creation failed'] };
  }

  // ✅ Order je kreiran — pošalji email
  const tax = cart.totalPrice * 0.08;
  const total = cart.totalPrice + shippingPrice + tax;

  // Fire-and-forget (ne čekamo response)
  sendOrderConfirmation({
    orderNumber: extractOrderNumber(data.orderCreate.order.name).toString(),
    customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
    email,
    items: cart.items,
    shippingAddress,
    subtotal: cart.totalPrice,
    shippingPrice,
    tax,
    total,
    paymentMethod: 'Cash on Delivery',
  }).catch(err => console.error('Email send failed:', err));

  return {
    success: true,
    orderId: data.orderCreate.order.id,
    orderNumber: extractOrderNumber(data.orderCreate.order.name),
    errors: [],
  };
}

function extractOrderNumber(name: string): number {
  const match = name.match(/#(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function mapCountryToCode(country: string): string {
  const map: Record<string, string> = {
    US: 'US', CA: 'CA', GB: 'GB', DE: 'DE', FR: 'FR',
    RS: 'RS', HR: 'HR', BA: 'BA',
  };
  return map[country] || 'US';
}