const fs = require('fs');
const path = require('path');

async function generateSitemap() {
  const baseUrl = 'https://shopify.usagi-it.com';

  console.log('🔍 Fetching products and collections...');

  const [products, collections] = await Promise.all([
    fetch('http://localhost:3000/api/sitemap-products').then(r => r.json()),
    fetch('http://localhost:3000/api/sitemap-collections').then(r => r.json()),
  ]);

  const urls = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    { loc: '/collections', priority: 0.7, changefreq: 'daily' },
    { loc: '/search', priority: 0.5, changefreq: 'weekly' },
    ...products.map(p => ({
      loc: p.url.replace(baseUrl, ''),
      lastmod: p.lastmod,
      priority: p.priority,
      changefreq: p.changefreq,
    })),
    ...collections.map(c => ({
      loc: c.url.replace(baseUrl, ''),
      lastmod: c.lastmod,
      priority: c.priority,
      changefreq: c.changefreq,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.join(__dirname, '..', 'public');

  // Generiši sitemap.xml
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log(`✅ Generated sitemap.xml with ${urls.length} URLs`);

  // Generiši robots.txt
  const robotsTxt = `# *
User-agent: *
Allow: /

# *
User-agent: *
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /api
Disallow: /wishlist

# Host
Host: ${baseUrl}

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('✅ Generated robots.txt');
}

generateSitemap().catch(err => {
  console.error('❌ Sitemap generation failed:', err.message);
  process.exit(1);
});