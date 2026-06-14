export interface CartItem {
    id: string;           // variant id
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