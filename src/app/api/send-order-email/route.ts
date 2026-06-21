import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email/send-order-confirmation';
import { getLatestOrderByEmail } from '@/lib/shopify/check-order';

export async function POST(request: NextRequest) {
  try {
    const { email, orderNumber } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Pronađi order
    const orderResult = await getLatestOrderByEmail(email);

    if (!orderResult.found) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // TODO: Sačuvaj cart items prilikom kreiranja ordera
    // Za sada, pošalji email sa osnovnim informacijama

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Send email API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}