import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import { getSession } from '@/lib/auth/actions';
import { getCustomer } from '@/lib/shopify/customer';
import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata: Metadata = genMeta({
  title: 'Register | Store',
  description: 'Create a new account',
});

export default async function RegisterPage() {
  const token = await getSession();
  if (token) {
    const customer = await getCustomer(token);
    if (customer) redirect('/account');
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mx-auto max-w-md">
        <h1 className="heading-md text-secondary-900 mb-6 text-center">Create Account</h1>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-secondary-500">
          Already have an account?{' '}
          <Link href="/account/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}