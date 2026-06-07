import Link from 'next/link';

interface FooterProps {
  collections: Array<{ handle: string; title: string }>;
}

export function Footer({ collections }: FooterProps) {
  return (
    <footer className="border-t border-secondary-200 bg-secondary-50">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-heading font-semibold text-primary-600">
              Store
            </Link>
            <p className="mt-3 text-sm text-secondary-500">
              Your destination for quality products.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider">
              Shop
            </h3>
            <ul className="mt-3 space-y-2">
              {collections.map((c) => (
                <li key={c.handle}>
                  <Link
                    href={`/collections/${c.handle}`}
                    className="text-sm text-secondary-500 hover:text-primary-600 transition-colors"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider">
              Account
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/account" className="text-sm text-secondary-500 hover:text-primary-600 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-sm text-secondary-500 hover:text-primary-600 transition-colors">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider">
              Info
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-secondary-500 hover:text-primary-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-secondary-500 hover:text-primary-600 transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-200 text-center">
          <p className="text-xs text-secondary-400">
            © {new Date().getFullYear()} Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}