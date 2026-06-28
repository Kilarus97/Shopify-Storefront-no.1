import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { getSession } from '@/lib/auth/actions';
import { getCustomer } from '@/lib/shopify/customer';
import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata: Metadata = genMeta({
  title: 'Checkout | Store',
  description: 'Complete your purchase',
});

export default async function CheckoutPage() {
  const token = await getSession();
  let customer = null;

  if (token) {
    const customerData = await getCustomer(token);
    customer = customerData.customer;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="heading-md text-secondary-900 mb-8">Checkout</h1>
      <CheckoutForm customer={customer} />
    </div>
  );
}