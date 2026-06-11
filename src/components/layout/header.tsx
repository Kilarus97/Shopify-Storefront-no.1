'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface HeaderProps {
  collections: Array<{ handle: string; title: string }>;
}

export function Header({ collections }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-secondary-200 bg-white/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-heading font-semibold text-primary-600">Store</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6">
          <li>
            <Link href="/collections" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors">
              All Collections
            </Link>
          </li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-secondary-500 hover:text-secondary-900 transition-colors"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>

          <Link
            href="/account"
            className="text-secondary-500 hover:text-secondary-900 transition-colors"
            aria-label="Account"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.762 0-5.393-.493-7.5-1.382Z" />
            </svg>
          </Link>

          <Link
            href="/cart"
            className="relative text-secondary-500 hover:text-secondary-900 transition-colors"
            aria-label="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 4.5A.25.25 0 0 1 2.5 4.25h.075a.25.25 0 0 1 .175.075L5.25 7l1.825-2.675A.25.25 0 0 1 7.25 4.25h.075a.25.25 0 0 1 .25.25v15a.25.25 0 0 1-.25.25H2.5a.25.25 0 0 1-.25-.25v-15ZM15.75 4.5a.25.25 0 0 1 .25.25v15a.25.25 0 0 1-.25.25H8.5a.25.25 0 0 1-.25-.25v-15a.25.25 0 0 1 .25-.25h7.25ZM21.75 10.5a2.25 2.25 0 0 0-2.25-2.25h-1.5V18h1.5a2.25 2.25 0 0 0 2.25-2.25v-5.25Z" />
            </svg>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-secondary-500"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-secondary-200 bg-white">
          <ul className="container mx-auto px-4 py-4 space-y-3">
            <li>
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-secondary-600 hover:text-primary-600"
              >
                All Collections
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}