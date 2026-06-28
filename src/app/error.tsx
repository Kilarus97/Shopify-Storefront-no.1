'use client';

import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-secondary-900">Something went wrong</h1>
      <p className="mt-4 text-secondary-500">
        An error occurred while loading this page.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-secondary-300 px-6 py-2.5 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}