'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { updateAddressAction, deleteAddressAction, setDefaultAddressAction } from '@/lib/auth/actions';

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

interface AddressFormProps {
  address: Address;
  isDefault: boolean;
  onCancel: () => void;
}

export function AddressForm({ address, isDefault, onCancel }: AddressFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors([]);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.set('addressId', address.id);

    const result = await updateAddressAction(formData);

    if (!result?.success) {
      setErrors(result?.errors || ['Update failed']);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/account?tab=profile');
        router.refresh();
      }, 1000);
    }

    setIsPending(false);
  };

  const handleDelete = async () => {
    setIsPending(true);
    const formData = new FormData();
    formData.set('addressId', address.id);

    const result = await deleteAddressAction(formData);

    if (!result?.success) {
      setErrors(result?.errors || ['Delete failed']);
      setIsPending(false);
    } else {
      router.push('/account?tab=profile');
      router.refresh();
    }
  };

  const handleSetDefault = async () => {
    setIsPending(true);
    const formData = new FormData();
    formData.set('addressId', address.id);

    const result = await setDefaultAddressAction(formData);

    if (!result?.success) {
      setErrors(result?.errors || ['Failed to set default']);
      setIsPending(false);
    } else {
      router.push('/account?tab=profile');
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          ✅ Address updated successfully!
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="addressId" value={address.id} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              First Name
            </label>
            <input
              name="firstName"
              type="text"
              required
              defaultValue={address.firstName}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Last Name
            </label>
            <input
              name="lastName"
              type="text"
              required
              defaultValue={address.lastName}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Address Line 1
          </label>
          <input
            name="address1"
            type="text"
            required
            defaultValue={address.address1}
            className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Address Line 2 (optional)
          </label>
          <input
            name="address2"
            type="text"
            defaultValue={address.address2 || ''}
            className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              City
            </label>
            <input
              name="city"
              type="text"
              required
              defaultValue={address.city}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              ZIP / Postal Code
            </label>
            <input
              name="zip"
              type="text"
              required
              defaultValue={address.zip}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Country
            </label>
            <input
              name="country"
              type="text"
              required
              defaultValue={address.country}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Phone (optional)
          </label>
          <input
            name="phone"
            type="tel"
            defaultValue={address.phone || ''}
            className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? 'Saving...' : 'Save Address'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Actions */}
      <div className="border-t border-secondary-200 pt-4 flex gap-3">
        {!isDefault && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSetDefault}
            disabled={isPending}
          >
            Set as Default
          </Button>
        )}

        {!showDeleteConfirm ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Delete Address
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Delete
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}