'use server';

import { shopifyAdminFetch } from './admin-client';

export async function getLatestOrderByEmail(email: string): Promise<{
  found: boolean;
  orderId?: string;
  orderNumber?: string;
  financialStatus?: string;
}> {
  const query = `
    query getLatestOrder($query: String!) {
      orders(first: 3, sortKey: CREATED_AT, reverse: true, query: $query) {
        edges {
          node {
            id
            name
            displayFinancialStatus
            createdAt
          }
        }
      }
    }
  `;

  try {
    const { data } = await shopifyAdminFetch<{
      orders: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            displayFinancialStatus: string;
            createdAt: string;
          };
        }>;
      };
    }>({
      query,
      variables: { query: `email:${email}` },
    });

    const orders = data.orders.edges;
    if (orders.length === 0) return { found: false };

    // Pronađi najnoviji order kreiran u poslednjih 15 minuta
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const paidStatuses = ['PAID', 'AUTHORIZED', 'PARTIALLY_PAID'];

    for (const { node: order } of orders) {
      const createdAt = new Date(order.createdAt);
      if (createdAt < fifteenMinutesAgo) continue;

      console.log(`📧 Order ${order.name} for ${email}: ${order.displayFinancialStatus}`);

      return {
        found: paidStatuses.includes(order.displayFinancialStatus),
        orderId: order.id,
        orderNumber: order.name,
        financialStatus: order.displayFinancialStatus,
      };
    }

    return { found: false };
  } catch (err) {
    console.error('❌ getLatestOrderByEmail error:', err);
    return { found: false };
  }
}