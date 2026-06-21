'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddressForm } from './address-form';

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone?: string | null;
}

interface AddressListProps {
  addresses: Address[];
  defaultAddressId: string | null;
}

export function AddressList({ addresses, defaultAddressId }: AddressListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (editingId) {
    const address = addresses.find((a) => a.id === editingId);
    if (address) {
      return (
        <AddressForm
          address={address}
          isDefault={address.id === defaultAddressId}
          onCancel={() => setEditingId(null)}
        />
      );
    }
  }

  if (addresses.length === 0) {
    return (
      <div className="rounded-lg border border-secondary-200 p-6 text-center">
        <p className="text-sm text-secondary-500">No saved addresses yet.</p>
        <p className="text-xs text-secondary-400 mt-1">
          Add an address during checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-secondary-700">Saved Addresses</h3>

      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`rounded-lg border p-4 ${
              address.id === defaultAddressId
                ? 'border-primary-300 bg-primary-50/50'
                : 'border-secondary-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="text-sm text-secondary-600 space-y-0.5">
                <p className="font-medium text-secondary-900">
                  {address.firstName} {address.lastName}
                  {address.id === defaultAddressId && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </p>
                <p>{address.address1}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>
                  {address.city}, {address.zip}
                </p>
                <p>{address.country}</p>
                {address.phone && <p>📞 {address.phone}</p>}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingId(address.id)}
                className="text-xs"
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}