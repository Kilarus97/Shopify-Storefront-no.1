import { getAllCollectionHandles } from '@/lib/shopify/collection';

export async function GET() {
    const collections = await getAllCollectionHandles();  // renamed for clarity
    const urls = collections.map(({ handle, updatedAt }) => ({
      url: `https://shopify.usagi-it.com/collections/${handle}`,
      lastmod: updatedAt,
      changefreq: 'weekly',
      priority: 0.7,
    }));
    return Response.json(urls);
  }

