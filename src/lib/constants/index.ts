export const SHOPIFY_STORE_DOMAIN = process.env.PUBLIC_STORE_DOMAIN || '';
export const SHOPIFY_STOREFRONT_ID = process.env.PUBLIC_STOREFRONT_ID || '';
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN: string = process.env.PUBLIC_STOREFRONT_ACCESS_TOKEN || '';
export const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';

export const SHOPIFY_GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_STOREFRONT_ID}/graphql.json`;

export const DEFAULT_PAGE_SIZE = 24;
export const PRODUCTS_PER_PAGE = 24;
export const COLLECTIONS_PER_PAGE = 12;

export const CACHE_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 600,
  STATIC: 86400,
} as const;

export const REVALIDATE_INTERVAL = {
  PRODUCT: 60,
  COLLECTION: 300,
  HOME: 60,
  BLOG: 3600,
  SITEMAP: 86400,
} as const;