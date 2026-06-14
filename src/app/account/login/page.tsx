import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { getSession } from '@/lib/auth/actions';
import { getCustomer } from '@/lib/shopify/customer';
import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata: Metadata = genMeta({
  title: 'Sign In | Store',
  description: 'Sign in to your account',
});

export default async function LoginPage() {
  const token = await getSession();
  if (token) {
    const customer = await getCustomer(token);
    if (customer) redirect('/account');
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mx-auto max-w-md">
        <h1 className="heading-md text-secondary-900 mb-6 text-center">Sign In</h1>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-secondary-500">
          Don&apos;t have an account?{' '}
          <Link href="/account/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}