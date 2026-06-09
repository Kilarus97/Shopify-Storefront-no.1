'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface FilterSidebarProps {
  categories: Array<{ handle: string; title: string }>;
  colors: string[];
  sizes: string[];
  minPrice?: number;
  maxPrice?: number;
}

export function FilterSidebar({
  categories,
  colors,
  sizes,
  minPrice = 0,
  maxPrice = 1000,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll(key);

      if (checked) {
        if (!current.includes(value)) {
          params.append(key, value);
        }
      } else {
        const filtered = current.filter((v) => v !== value);
        params.delete(key);
        filtered.forEach((v) => params.append(key, v));
      }

      // Reset to page 1 on filter change
      params.delete('page');

      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const isChecked = useCallback(
    (key: string, value: string) => {
      return searchParams.getAll(key).includes(value);
    },
    [searchParams]
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    router.push(`/search?${params.toString()}`);
  }, [router, searchParams]);

  const hasFilters = Array.from(searchParams.keys()).some((k) =>
    ['category', 'color', 'size', 'inStock'].includes(k)
  );

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider">
          Filters
        </h3>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary-600 hover:text-primary-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-secondary-900 mb-2">Category</h4>
            <ul className="space-y-1.5">
              {categories.map((cat) => (
                <li key={cat.handle}>
                  <label className="flex items-center gap-2 text-sm text-secondary-600 cursor-pointer hover:text-secondary-900">
                    <input
                      type="checkbox"
                      checked={isChecked('category', cat.handle)}
                      onChange={(e) => updateFilter('category', cat.handle, e.target.checked)}
                      className="rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                    />
                    {cat.title}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price Range */}
        <div>
          <h4 className="text-sm font-medium text-secondary-900 mb-2">Price</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min={0}
              defaultValue={searchParams.get('price_min') || ''}
              className="w-full rounded border border-secondary-300 px-2 py-1.5 text-sm"
              onBlur={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) {
                  params.set('price_min', e.target.value);
                } else {
                  params.delete('price_min');
                }
                router.push(`/search?${params.toString()}`);
              }}
            />
            <span className="text-secondary-400">–</span>
            <input
              type="number"
              placeholder="Max"
              min={0}
              defaultValue={searchParams.get('price_max') || ''}
              className="w-full rounded border border-secondary-300 px-2 py-1.5 text-sm"
              onBlur={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) {
                  params.set('price_max', e.target.value);
                } else {
                  params.delete('price_max');
                }
                router.push(`/search?${params.toString()}`);
              }}
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
                      checked={isChecked('color', color)}
                      onChange={(e) => updateFilter('color', color, e.target.checked)}
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
                      checked={isChecked('size', size)}
                      onChange={(e) => updateFilter('size', size, e.target.checked)}
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
              checked={searchParams.get('inStock') === 'true'}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.checked) {
                  params.set('inStock', 'true');
                } else {
                  params.delete('inStock');
                }
                router.push(`/search?${params.toString()}`);
              }}
              className="rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
            />
            In Stock Only
          </label>
        </div>
      </div>
    </aside>
  );
}