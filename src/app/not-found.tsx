import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-secondary-900">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-secondary-700">
        Page Not Found
      </h2>
      <p className="mt-2 text-secondary-500">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/search"
          className="rounded-lg border border-secondary-300 px-6 py-2.5 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
        >
          Search Products
        </Link>
      </div>
    </div>
  );
}