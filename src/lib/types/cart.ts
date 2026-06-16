export interface CartItem {
    id: string;           // cart item id (unique per cart)
    variantId: string;    // Shopify variant id (gid://shopify/ProductVariant/...)
    productId: string;
    title: string;
    handle: string;
    variantTitle: string;
    price: number;
    compareAtPrice: number | null;
    quantity: number;
    image: {
      url: string;
      altText: string | null;
    } | null;
    availableForSale: boolean;
  }
  
  export interface Cart {
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
  }