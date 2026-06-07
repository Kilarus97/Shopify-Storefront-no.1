import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    'https://{PUBLIC_STORE_DOMAIN}/api/{PUBLIC_STOREFRONT_ID}/graphql.json': {
      headers: {
        'X-Shopify-Storefront-Access-Token': '{SHOPIFY_STOREFRONT_ACCESS_TOKEN}',
      },
    },
  },
  documents: ['src/lib/shopify/queries/**/*.graphql', 'src/lib/shopify/fragments/**/*.graphql'],
  generates: {
    './src/lib/shopify/generated/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        scalars: {
          DateTime: 'string', Decimal: 'string',
          URL: 'string', HTML: 'string', JSON: 'unknown',
        },
      },
    },
  },
};

export default config;