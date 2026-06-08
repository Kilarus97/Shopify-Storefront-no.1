export interface ShopifyImage {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  }
  
  export interface MoneyV2 {
    amount: string;
    currencyCode: string;
  }
  
  export interface ProductVariant {
    id: string;
    title: string;
    availableForSale: boolean;
    price: MoneyV2;
    compareAtPrice: MoneyV2 | null;
    selectedOptions: SelectedOption[];
    image: ShopifyImage | null;
    sku: string | null;
    weight: number | null;
  }
  
  export interface SelectedOption {
    name: string;
    value: string;
  }
  
  export interface ProductOption {
    id: string;
    name: string;
    values: string[];
  }
  
  export interface Product {
    id: string;
    handle: string;
    title: string;
    description: string;
    descriptionHtml: string;
    vendor: string;
    productType: string;
    tags: string[];
    featuredImage: ShopifyImage | null;
    images: ShopifyImage[];
    variants: ProductVariant[];        // ← ovo je niz
    priceRange: {
      minVariantPrice: MoneyV2;
      maxVariantPrice: MoneyV2;
    };
    compareAtPriceRange: {
      minVariantPrice: MoneyV2;
      maxVariantPrice: MoneyV2;
    };
    options: ProductOption[];
    seo: {
      title: string | null;
      description: string | null;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Collection {
    id: string;
    handle: string;
    title: string;
    description: string;
    descriptionHtml: string;
    image: ShopifyImage | null;
    products: Product[];
    seo: {
      title: string | null;
      description: string | null;
    };
    updatedAt: string;
  }
  
  export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  }