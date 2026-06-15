import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as genMeta } from '@/lib/utils/seo';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = genMeta({
  title: 'Order Confirmed | Store',
  description: 'Your order has been placed successfully',
});

interface ConfirmationPageProps {
  searchParams: { order?: string; number?: string };
}

export default function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const orderNumber = searchParams.number;

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 text-center">
      <div className="mx-auto max-w-lg">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="heading-md text-secondary-900 mb-2">Order Confirmed!</h1>

        {orderNumber && (
          <p className="text-secondary-500 mb-2">
            Order <span className="font-semibold text-secondary-900">#{orderNumber}</span> has been placed successfully.
          </p>
        )}

        <p className="text-secondary-500 mb-8">
          Thank you for your purchase. You will receive a confirmation email shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/collections">
            <Button>Continue Shopping</Button>
          </Link>
          <Link href="/account">
            <Button variant="outline">View Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}