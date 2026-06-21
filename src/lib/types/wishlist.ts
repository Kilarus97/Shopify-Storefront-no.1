export interface WishlistItem {
  id: string; 
  productId: string;
  variantId: string;
  title: string;
  handle: string;
  price: string;
  currencyCode: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  availableForSale: boolean;
  addedAt: string;
}

// Za metafield storage
export interface WishlistMetafield {
  productIds: string[]; // ["gid://shopify/Product/123", ...]
}