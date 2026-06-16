import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession, logoutAction } from '@/lib/auth/actions';
import { getCustomer } from '@/lib/shopify/customer';
import { generateMetadata as genMeta } from '@/lib/utils/seo';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = genMeta({
  title: 'My Account | Store',
  description: 'Manage your account',
});

export default async function AccountPage() {
  const token = await getSession();
  if (!token) redirect('/account/login');

  const customer = await getCustomer(token);
  if (!customer) redirect('/account/login');

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-md text-secondary-900">My Account</h1>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm">
            Sign Out
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="rounded-lg border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Profile</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-secondary-500">Name</dt>
                <dd className="text-secondary-900">{customer.firstName} {customer.lastName}</dd>
              </div>
              <div>
                <dt className="text-secondary-500">Email</dt>
                <dd className="text-secondary-900">{customer.email}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order History</h2>

          {customer.orders?.edges?.length === 0 ? (
            <div className="rounded-lg border border-secondary-200 p-8 text-center">
              <p className="text-secondary-500">No orders yet.</p>
              <Link href="/collections" className="mt-2 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium">
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {customer.orders?.edges?.map(({ node: order }) => (
                <div key={order.id} className="rounded-lg border border-secondary-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-secondary-900">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-xs text-secondary-500">
                      {new Date(order.processedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">
                      {order.lineItems.edges.length} item{order.lineItems.edges.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm font-medium text-secondary-900">
                      ${order.totalPrice.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}