'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SHOPIFY_STORE_PASSWORD, SHOPIFY_STORE_DOMAIN } from '@/lib/constants';

interface PasswordStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export function PasswordStep({ onComplete, onBack }: PasswordStepProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenPasswordPage = () => {
    setIsOpening(true);

    // Otvori Shopify password stranicu u novom tab-u
    const passwordUrl = 'https://usagi-it.myshopify.com/password'

    const newTab = window.open(passwordUrl, '_blank');

    // Proveri da li se tab zatvara (korisnik je uneo password)
    const checkTabClosed = setInterval(() => {
      if (newTab?.closed) {
        clearInterval(checkTabClosed);
        setIsOpening(false);
        onComplete();
      }
    }, 1000);

    // Timeout: ako se tab ne zatvori u 5 minuta, dozvoli dalje
    setTimeout(() => {
      clearInterval(checkTabClosed);
      setIsOpening(false);
    }, 5 * 60 * 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-2">Store Access</h2>
        <p className="text-sm text-secondary-500 mb-4">
          This store is password-protected. Open the store page in a new tab to enter the password before completing your purchase.
        </p>
        <p className="text-sm text-secondary-500 mb-4">
          Button for opening the store page is below. After entering the password, return to this page to continue.
        </p>
        <p className="text-sm text-secondary-500 mb-4">
          Button for entering password is located on the store page, in upper right corner named Enter using password.
        </p>
      </div>

      {/* Info box */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-600 mt-0.5 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">Password Required</p>
            <p className="text-sm text-amber-700 mt-1">
              When prompted, use this password:
            </p>
            <div className="mt-2 bg-amber-100 rounded px-3 py-2 inline-block">
              <code className="text-base font-mono font-bold text-amber-900 select-all">
                sayffi
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Open store button */}
      <div className="space-y-3">
        <Button
          onClick={handleOpenPasswordPage}
          className="w-full"
          size="lg"
          disabled={isOpening}
        >
          {isOpening ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Waiting for password...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Open Store in New Tab
            </>
          )}
        </Button>

        <p className="text-xs text-secondary-400 text-center">
          A new tab will open. Enter the password there, and this page will continue automatically.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          ← Back to Payment
        </Button>
      </div>
    </div>
  );
}