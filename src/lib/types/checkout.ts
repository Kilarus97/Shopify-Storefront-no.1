export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  }
  
  export interface ShippingOption {
    id: string;
    title: string;
    description: string;
    price: number;
  }
  
  export interface PaymentMethod {
    id: string;
    title: string;
    description: string;
    icon?: string;
  }
  
  export interface CheckoutState {
    step: 'shipping' | 'delivery' | 'payment' | 'review';
    email: string;
    shippingAddress: ShippingAddress | null;
    shippingOption: ShippingOption | null;
    paymentMethod: PaymentMethod | null;
    note?: string;
  }