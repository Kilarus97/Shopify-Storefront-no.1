'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ProductOption, ProductVariant } from '@/lib/types';

interface ProductVariantsProps {
  options: ProductOption[];
  variants: ProductVariant[];
  onVariantChange?: (variant: ProductVariant | null) => void;
}

export function ProductVariants({
  options,
  variants,
  onVariantChange,
}: ProductVariantsProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleOptionChange = useCallback(
    (optionName: string, value: string) => {
      const newSelected = { ...selectedOptions, [optionName]: value };
      setSelectedOptions(newSelected);

      // Find matching variant
      const matchingVariant = variants.find((v) =>
        v.selectedOptions.every(
          (o) => newSelected[o.name] === o.value
        )
      );

      if (matchingVariant) {
        onVariantChange?.(matchingVariant);
      }
    },
    [selectedOptions, variants, onVariantChange]
  );

  if (!options.length) return null;

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <label className="text-sm font-medium text-secondary-900">
            {option.name}
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;

              // Check if this option value is available
              const isAvailable = variants.some(
                (v) =>
                  v.availableForSale &&
                  v.selectedOptions.some(
                    (o) => o.name === option.name && o.value === value
                  )
              );

              return (
                <button
                  key={value}
                  onClick={() => handleOptionChange(option.name, value)}
                  disabled={!isAvailable}
                  className={cn(
                    'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-secondary-300 text-secondary-700 hover:border-secondary-400',
                    !isAvailable && 'opacity-40 cursor-not-allowed line-through'
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}