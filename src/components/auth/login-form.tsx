'use client';

import { useState } from 'react';
import { loginAction } from '@/lib/auth/actions';

export function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors([]);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (!result?.success) {
      setErrors(result?.errors || ['Login failed']);
    }

    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          placeholder="Your password"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-primary-500 py-2.5 text-sm font-medium text-black  hover:bg-primary-600 transition-colors border border-black"
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}