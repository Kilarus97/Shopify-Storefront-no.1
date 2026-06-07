import Link from 'next/link';
import Image from 'next/image';
import type { Collection } from '@/lib/types';

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.handle}`}
      className="group relative block overflow-hidden rounded-lg"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-secondary-100">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-100">
            <span className="text-2xl font-heading font-semibold text-primary-600">
              {collection.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-xl font-heading font-semibold text-white">
            {collection.title}
          </h2>
          {collection.description && (
            <p className="mt-1 text-sm text-white/80 line-clamp-2">
              {collection.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}