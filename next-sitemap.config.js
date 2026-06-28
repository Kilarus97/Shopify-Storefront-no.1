/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://usagi-it.myshopify.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/cart', '/checkout', '/account/**', '/api/**', '/wishlist'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/cart', '/checkout', '/account', '/api', '/wishlist'] },
    ],
  },
  additionalPaths: async () => {
    const base = 'http://localhost:3000';
    const paths = [];
    console.log('🔍 Fetching from:', base);  // <-- DODAJ

    try {
      const [productsRes, collectionsRes] = await Promise.all([
        fetch(`${base}/api/sitemap-products`),
        fetch(`${base}/api/sitemap-collections`),
      ]);

      if (!productsRes.ok || !collectionsRes.ok) {
        throw new Error(`API not available: products=${productsRes.status} collections=${collectionsRes.status}`);
      }

      const products = await productsRes.json();
      const collections = await collectionsRes.json();

      paths.push(...products, ...collections);
      console.log(`✅ Sitemap: ${products.length} products, ${collections.length} collections`);
    } catch (e) {
      console.warn('⚠️ Sitemap dynamic paths fetch failed:', e.message);
      console.log('💡 Make sure dev server is running: npm run dev');
    }
    console.log('📦 paths:', JSON.stringify(paths, null, 2));  // <-- DODAJ
    return paths;
  },
};