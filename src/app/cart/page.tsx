import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CartPage } from '@/components/cart/cart-page';
import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata: Metadata = genMeta({
  title: 'Shopping Cart | Store',
  description: 'Your shopping cart',
});

export default function Cart() {
  return <CartPage />;
}