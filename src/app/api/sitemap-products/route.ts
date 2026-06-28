import { getAllProductHandles } from '@/lib/shopify/product';

export async function GET() {
    const products = await getAllProductHandles();
    const urls = products.map(({ handle, updatedAt }) => ({
      url: `https://shopify.usagi-it.com/products/${handle}`,
      lastmod: updatedAt,
      changefreq: 'weekly',
      priority: 0.8,
    }));
    return Response.json(urls);
  }

