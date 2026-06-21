'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  orderNumber: number;
  totalPrice: { amount: string; currencyCode: string };
  processedAt: string;
  fulfillmentStatus: string;
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          price: { amount: string; currencyCode: string };
          image: { url: string; altText: string | null } | null;
        } | null;
      };
    }>;
  };
}

interface OrderHistoryProps {
  orders: Order[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

export function OrderHistory({ orders, pageInfo }: OrderHistoryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = (cursor: string | null, direction: 'next' | 'prev') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'orders');

    if (cursor) {
      params.set('ordersAfter', cursor);
    } else {
      params.delete('ordersAfter');
    }

    startTransition(() => {
      router.push(`/account?${params.toString()}`);
    });
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-secondary-200 p-8 text-center">
        <p className="text-secondary-500">No orders yet.</p>
        <Link
          href="/collections"
          className="mt-2 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Start shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order History</h2>

      {/* Orders list */}
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-secondary-200 p-4 hover:border-secondary-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary-900">
                Order #{order.orderNumber}
              </span>
              <span className="text-xs text-secondary-500">
                {new Date(order.processedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Order items preview */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {order.lineItems.edges.slice(0, 3).map(({ node: item }, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {item.variant?.image && (
                    <img
                      src={item.variant.image.url}
                      alt={item.variant.image.altText || item.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <span className="text-xs text-secondary-500">
                    {item.title} × {item.quantity}
                  </span>
                </div>
              ))}
              {order.lineItems.edges.length > 3 && (
                <span className="text-xs text-secondary-400">
                  +{order.lineItems.edges.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-secondary-600">
                  {order.lineItems.edges.length} item
                  {order.lineItems.edges.length !== 1 ? 's' : ''}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    order.fulfillmentStatus === 'FULFILLED'
                      ? 'bg-green-100 text-green-700'
                      : order.fulfillmentStatus === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-secondary-100 text-secondary-600'
                  }`}
                >
                  {order.fulfillmentStatus === 'FULFILLED'
                    ? 'Shipped'
                    : order.fulfillmentStatus === 'IN_PROGRESS'
                    ? 'Processing'
                    : 'Pending'}
                </span>
              </div>
              <span className="text-sm font-medium text-secondary-900">
                {order.totalPrice.amount} Din
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {(pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
        <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
          <Button
            variant="outline"
            size="sm"
            disabled={!pageInfo.hasPreviousPage || isPending}
            onClick={() => goToPage(null, 'prev')}
          >
            ← Previous
          </Button>

          <span className="text-xs text-secondary-400">
            {isPending ? 'Loading...' : `Showing ${orders.length} orders`}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={!pageInfo.hasNextPage || isPending}
            onClick={() => goToPage(pageInfo.endCursor, 'next')}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}