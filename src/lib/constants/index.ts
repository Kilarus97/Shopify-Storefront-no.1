export const SHOPIFY_STORE_DOMAIN = process.env.PUBLIC_STORE_DOMAIN || '';
//export const SHOPIFY_STOREFRONT_ID = process.env.PUBLIC_STOREFRONT_ID || '';
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN: string = process.env.PUBLIC_STOREFRONT_ACCESS_TOKEN || '';
export const SHOPIFY_STORE_PASSWORD = process.env.SHOPIFY_STORE_PASSWORD || '';
export const NEXT_PUBLIC_STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3000';
export const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
export const STORE_EMAIL = process.env.RESEND_EMAIL || '';
export const ADMIN_API_VERSION = '2024-01';

export const SHOPIFY_GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`;

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