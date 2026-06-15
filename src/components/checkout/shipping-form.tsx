'use client';

import { useState } from 'react';
import type { ShippingAddress } from '@/lib/types/checkout';
import type { CustomerResponse } from '@/lib/shopify/customer';
import { Button } from '@/components/ui/button';

interface ShippingFormProps {
  customer: CustomerResponse['customer'] | null;
  onSubmit: (address: ShippingAddress, email: string) => void;
  isPending: boolean;
}

export function ShippingForm({ customer, onSubmit, isPending }: ShippingFormProps) {
  const [email, setEmail] = useState(customer?.email || '');
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'US',
    phone: customer?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(address, email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Contact Information</h2>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Shipping Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={address.firstName}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={address.lastName}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address1" className="block text-sm font-medium text-secondary-700 mb-1">
              Address
            </label>
            <input
              id="address1"
              name="address1"
              type="text"
              required
              value={address.address1}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
              placeholder="Street address"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address2" className="block text-sm font-medium text-secondary-700 mb-1">
              Apartment, suite, etc. (optional)
            </label>
            <input
              id="address2"
              name="address2"
              type="text"
              value={address.address2}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-secondary-700 mb-1">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={address.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="province" className="block text-sm font-medium text-secondary-700 mb-1">
              State / Province
            </label>
            <input
              id="province"
              name="province"
              type="text"
              required
              value={address.province}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-secondary-700 mb-1">
              ZIP / Postal Code
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              required
              value={address.zip}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-secondary-700 mb-1">
              Country
            </label>
            <select
              id="country"
              name="country"
              required
              value={address.country}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="RS">Serbia</option>
              <option value="HR">Croatia</option>
              <option value="BA">Bosnia and Herzegovina</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={address.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? 'Processing...' : 'Continue to Delivery'}
      </Button>
    </form>
  );
}