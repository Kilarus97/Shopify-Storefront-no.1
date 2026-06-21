'use server';

import { resend } from './resend';
import { InvoiceEmail } from './templates';
import { STORE_EMAIL } from '@/lib/constants';
import type { CartItem } from '@/lib/types/cart';
import type { ShippingAddress } from '@/lib/types/checkout';

interface SendOrderConfirmationProps {
  orderNumber: string;
  customerName: string;
  email: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingPrice: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

export async function sendOrderConfirmation({
  orderNumber,
  customerName,
  email,
  items,
  shippingAddress,
  subtotal,
  shippingPrice,
  tax,
  total,
  paymentMethod,
}: SendOrderConfirmationProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Store <${STORE_EMAIL}>`,
      to: [email],
      subject: `Order Confirmation #${orderNumber}`,
      react: InvoiceEmail({
        orderNumber,
        customerName,
        email,
        items,
        shippingAddress,
        subtotal,
        shippingPrice,
        tax,
        total,
        paymentMethod,
        orderDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }),
    });

    if (error) {
      console.error('❌ Email send error:', error);
      return { success: false, error: error.message };
    }

    console.log(`📧 Order confirmation sent to ${email}:`, data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('❌ Email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}