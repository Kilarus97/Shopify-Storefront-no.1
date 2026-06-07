import { formatMoney } from '@/lib/utils/format';
import type { MoneyV2 } from '@/lib/types';

interface PriceProps {
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  className?: string;
}

export function Price({ price, compareAtPrice, className }: PriceProps) {
  const hasDiscount =
    compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div className={className}>
      {hasDiscount ? (
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-red-600">
            {formatMoney(price)}
          </span>
          <span className="text-sm text-secondary-400 line-through">
            {formatMoney(compareAtPrice!)}
          </span>
        </div>
      ) : (
        <span className="text-lg font-semibold text-secondary-900">
          {formatMoney(price)}
        </span>
      )}
    </div>
  );
}