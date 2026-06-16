'use client';

import { Button } from '@/components/ui/button';
import type { ShippingOption } from '@/lib/types/checkout';

interface ShippingOptionsProps {
  options: ShippingOption[];
  selected: ShippingOption | null;
  onSelect: (option: ShippingOption) => void;
  onBack: () => void;
}

export function ShippingOptions({ options, selected, onSelect, onBack }: ShippingOptionsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-secondary-900">Delivery Method</h2>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            className={`w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
              selected?.id === option.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-secondary-300'
            }`}
          >
            <div>
              <p className="text-sm font-medium text-secondary-900">{option.title}</p>
              <p className="text-xs text-secondary-500">{option.description}</p>
            </div>
            <span className="text-sm font-medium text-secondary-900">
              {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}