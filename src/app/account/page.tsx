import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth/actions';
import { getCustomer } from '@/lib/shopify/customer';
import { generateMetadata as genMeta } from '@/lib/utils/seo';
import { ProfileForm } from '@/components/account/profile-form';
import { OrderHistory } from '@/components/account/order-history';

export const metadata: Metadata = genMeta({
  title: 'My Account | Store',
  description: 'Manage your account',
});

interface AccountPageProps {
  searchParams: Promise<{
    tab?: string;
    updated?: string;
    ordersAfter?: string;
  }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const token = await getSession();
  if (!token) redirect('/account/login');

  const { customer, ordersPageInfo } = await getCustomer(
    token,
    params.ordersAfter || null,
    5
  );

  if (!customer) redirect('/account/login');

  const activeTab = params.tab || 'orders';
  const isUpdated = params.updated === 'true';

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-md text-secondary-900">My Account</h1>
      </div>

      {isUpdated && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-secondary-200 mb-6">
        <nav className="flex gap-6">
          <Link
            href="/account?tab=orders"
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            Order History
          </Link>
          <Link
            href="/account?tab=profile"
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            Profile
          </Link>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'orders' && (
        <OrderHistory
          orders={customer.orders.edges.map(({ node }) => node)}
          pageInfo={ordersPageInfo}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileForm customer={customer} />
      )}
    </div>
  );
}