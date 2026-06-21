// src/app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCustomerWishlist, updateCustomerWishlist } from '@/lib/shopify/wishlist';
import { getSession } from '@/lib/auth/actions';
import { shopifyAdminFetch } from '@/lib/shopify/admin-client';

export async function GET() {
  const token = await getSession();
  if (!token) return NextResponse.json([], { status: 401 });

  const ids = await getCustomerWishlist(token);
  if (ids.length === 0) return NextResponse.json([]);

  // ✅ Učitaj proizvode direktno kroz Admin API
  const query = `
    query getProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            edges {
              node {
                id
                price
                availableForSale
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyAdminFetch<{
    nodes: Array<{
      id: string;
      title: string;
      handle: string;
      featuredImage: { url: string; altText: string | null } | null;
      variants: {
        edges: Array<{
          node: {
            id: string;
            price: string;
            availableForSale: boolean;
          };
        }>;
      };
    } | null>;
  }>({
    query,
    variables: { ids },
  });

  const products = (data.nodes || [])
    .filter((n): n is NonNullable<typeof n> => n !== null)
    .map((node) => {
      const variant = node.variants.edges[0]?.node;
      return {
        id: node.id,
        productId: node.id,
        variantId: variant?.id || '',
        title: node.title,
        handle: node.handle,
        price: variant?.price || '0',
        currencyCode: 'USD',
        image: node.featuredImage,
        availableForSale: variant?.availableForSale || false,
        addedAt: new Date().toISOString(),
      };
    });

  return NextResponse.json({ ids, products });
}

export async function POST(request: NextRequest) {
  const token = await getSession();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { productIds } = await request.json();
  const result = await updateCustomerWishlist(token, productIds);
  return NextResponse.json(result);
}
