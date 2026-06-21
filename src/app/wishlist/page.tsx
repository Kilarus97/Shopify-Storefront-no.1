import { Metadata } from 'next';
import { WishlistPage } from '@/components/wishlist/wishlist-page';
import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata: Metadata = genMeta({
  title: 'My Wishlist | Store',
  description: 'Your saved products',
});

export default function Wishlist() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <WishlistPage />
    </div>
  );
}