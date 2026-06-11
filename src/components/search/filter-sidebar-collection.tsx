'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface FilterSidebarProps {
  colors: string[];
  sizes: string[];
  minPrice?: number;
  maxPrice?: number;
}

export function FilterSidebarCollection({
  colors,
  sizes,
  minPrice = 0,
  maxPrice = 1000,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lokalni state za filtere (ne primenjuju se dok korisnik ne klikne Search)
  const [selectedColors, setSelectedColors] = useState<string[]>(
    searchParams.getAll('color')
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    searchParams.getAll('size')
  );
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();

    // Čuvaj sort ako postoji
    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);

    // Dodaj filtere
    selectedColors.forEach((c) => params.append('color', c));
    selectedSizes.forEach((s) => params.append('size', s));
    if (priceMin) params.set('price_min', priceMin);
    if (priceMax) params.set('price_max', priceMax);
    if (inStock) params.set('inStock', 'true');

    router.push(`?${params.toString()}`);
  }, [router, searchParams, selectedColors, selectedSizes, priceMin, priceMax, inStock]);

  const handleClear = useCallback(() => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceMin('');
    setPriceMax('');
    setInStock(false);

    const params = new URLSearchParams();
    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const hasFilters =
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    priceMin ||
    priceMax ||
    inStock;

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider">
          Filters
        </h3>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="text-xs text-primary-600 hover:text-primary-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="text-sm font-medium text-secondary-900 mb-2">Price</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min={0}
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full rounded border border-secondary-300 px-2 py-1.5 text-sm"
            />
            <span className="text-secondary-400">–</span>
            <input
              type="number"
              placeholder="Max"
              min={0}
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full rounded border border-secondary-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-secondary-900 mb-2">Color</h4>
            <ul className="space-y-1.5">
              {colors.map((color) => (
                <li key={color}>
                  <label className="flex items-center gap-2 text-sm text-secondary-600 cursor-pointer hover:text-secondary-900">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColor(color)}
                      className="rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                    />
                    {color}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-secondary-900 mb-2">Size</h4>
            <ul className="space-y-1.5">
              {sizes.map((size) => (
                <li key={size}>
                  <label className="flex items-center gap-2 text-sm text-secondary-600 cursor-pointer hover:text-secondary-900">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                    />
                    {size}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Availability */}
        <div>
          <h4 className="text-sm font-medium text-secondary-900 mb-2">Availability</h4>
          <label className="flex items-center gap-2 text-sm text-secondary-600 cursor-pointer hover:text-secondary-900">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
            />
            In Stock Only
          </label>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full rounded-lg bg-primary-500 py-2.5 text-sm font-medium text-black  hover:bg-primary-600 transition-colors border border-black"
        >
          Search
        </button>
      </div>
    </aside>
  );
}