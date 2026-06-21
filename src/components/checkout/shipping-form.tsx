'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { ShippingAddress } from '@/lib/types/checkout';
import type { CustomerResponse } from '@/lib/shopify/customer';

interface ShippingFormProps {
  customer: CustomerResponse['customer'] | null;
  onSubmit: (address: ShippingAddress, email: string) => void;
  isPending: boolean;
}

export function ShippingForm({ customer, onSubmit, isPending }: ShippingFormProps) {
  const [email, setEmail] = useState(customer?.email || '');
  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [lastName, setLastName] = useState(customer?.lastName || '');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('US');
  const [phone, setPhone] = useState('');

  // Popuni formu sa default adresom korisnika
  const handleUseDefaultAddress = () => {
    if (!customer?.defaultAddress) return;

    const addr = customer.defaultAddress;
    setFirstName(addr.firstName);
    setLastName(addr.lastName);
    setAddress1(addr.address1);
    setAddress2(addr.address2 || '');
    setCity(addr.city);
    setProvince(addr.province);
    setZip(addr.zip);
    setCountry(addr.country);
    setPhone(addr.phone || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        firstName,
        lastName,
        address1,
        address2,
        city,
        province,
        zip,
        country,
        phone,
      },
      email
    );
  };

  const hasDefaultAddress = !!customer?.defaultAddress;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-2">Shipping Address</h2>
        <p className="text-sm text-secondary-500">
          Enter your shipping address for this order.
        </p>
      </div>

      {/* Use Default Address dugme */}
      {hasDefaultAddress && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-800">Use your default address</p>
              <p className="text-xs text-primary-600 mt-0.5">
                {customer?.defaultAddress?.firstName} {customer?.defaultAddress?.lastName},{' '}
                {customer?.defaultAddress?.address1}, {customer?.defaultAddress?.city}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUseDefaultAddress}
              className="border-primary-300 text-primary-700 hover:bg-primary-100"
            >
              Use Default
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        {/* First / Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Address Line 1 */}
        <div>
          <label htmlFor="address1" className="block text-sm font-medium text-secondary-700 mb-1">
            Address Line 1
          </label>
          <input
            id="address1"
            type="text"
            required
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            placeholder="123 Main St"
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-secondary-700 mb-1">
            Address Line 2 (optional)
          </label>
          <input
            id="address2"
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            placeholder="Apt, suite, unit, etc."
          />
        </div>

        {/* City / Province */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-secondary-700 mb-1">
              City
            </label>
            <input
              id="city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
        </div>

        {/* ZIP / Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-secondary-700 mb-1">
              ZIP / Postal Code
            </label>
            <input
              id="zip"
              type="text"
              required
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-secondary-700 mb-1">
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
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
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            Continue to Delivery →
          </Button>
        </div>
      </form>
    </div>
  );
}