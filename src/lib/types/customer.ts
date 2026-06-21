export interface CustomerAddress {
    id: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone: string | null;
  }
  
  export interface CustomerProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    defaultAddress: CustomerAddress | null;
    addresses: CustomerAddress[];
  }
  
  export interface UpdateCustomerInput {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }