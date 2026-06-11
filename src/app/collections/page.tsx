import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify/collection';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata: Metadata = genMeta({
  title: 'Collections | Store',
  description: 'Browse all product collections',
});



export default async function CollectionsPage() {
  const collections = await getCollections();
  const colors = ['Red', 'Blue', 'Purple', 'Black', 'White', 'Green', 'Yellow'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const categories = [
    { handle: 'frontpage', title: 'Home page' },
    { handle: 'automated-collection', title: 'Automated Collection' },
    { handle: 'hydrogen', title: 'Hydrogen' },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      <Breadcrumbs items={[{ label: 'Collections' }]} />

      <h1 className="heading-md text-secondary-900 mb-8">Collections</h1>

      {collections.length === 0 ? (
        <p className="text-secondary-400">No collections found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group relative overflow-hidden rounded-lg border border-secondary-200 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary-100">
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-secondary-300">
                    No image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                  {collection.title}
                </h2>
                {collection.description && (
                  <p className="mt-1 text-sm text-secondary-500 line-clamp-2">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}