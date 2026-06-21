'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/lib/auth/actions';
import { AddressList } from './address-list';
import type { CustomerResponse } from '@/lib/shopify/customer';

interface ProfileFormProps {
  customer: CustomerResponse['customer'];
}

export function ProfileForm({ customer }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  if (!customer) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors([]);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (!result?.success) {
      setErrors(result?.errors || ['Update failed']);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/account?tab=profile&updated=true');
        router.refresh();
      }, 1000);
    }

    setIsPending(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Profile Info */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Profile Information</h2>

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            ✅ Profile updated successfully!
          </div>
        )}

        {errors.length > 0 && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                defaultValue={customer.firstName}
                className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
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
                defaultValue={customer.lastName}
                className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={customer.email}
              disabled
              className="w-full rounded-lg border border-secondary-200 bg-secondary-50 px-3 py-2 text-sm text-secondary-500 cursor-not-allowed"
            />
            <p className="text-xs text-secondary-400 mt-1">To change email, please contact support.</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={customer.phone || ''}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* Right: Saved Addresses */}
      <div>
        <AddressList
          addresses={customer.addresses.edges.map(({ node }) => ({
            id: node.id,
            firstName: node.firstName || '',
            lastName: node.lastName || '',
            address1: node.address1 || '',
            address2: node.address2 || undefined,
            province: node.province || '',
            city: node.city || '',
            zip: node.zip || '',
            country: node.country || '',
            phone: node.phone || undefined,
          }))}
          defaultAddressId={customer.defaultAddress?.id || null}
        />
      </div>
    </div>
  );
}