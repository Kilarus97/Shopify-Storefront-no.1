'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getProduct } from '@/lib/shopify/product';
import type { WishlistItem } from '@/lib/types/wishlist';

interface WishlistContextValue {
  items: WishlistItem[];
  isLoading: boolean;
  isLoggedIn: boolean;
  addItem: (productId: string, item: Omit<WishlistItem, 'addedAt'>) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  toggleItem: (productId: string, item: Omit<WishlistItem, 'addedAt'>) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function gidToProductId(gid: string): string {
  return gid.replace('gid://shopify/Product/', '');
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Proveri sesiju
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { getSession } = await import('@/lib/auth/actions');
        const token = await getSession();
        setIsLoggedIn(!!token);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

  // ✅ Čitaj wishlist kroz API route (server-side)
  const refreshWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/wishlist');
      if (!res.ok) {
        setItems([]);
        setProductIds([]);
        return;
      }
  
      const { ids, products } = await res.json();
      setProductIds(ids || []);
      setItems(products || []);
  
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
    setIsLoading(false);
  }, []);
  
  

  // ✅ Učitaj samo jednom
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      refreshWishlist();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Piši wishlist kroz API route
  const saveWishlist = useCallback(async (ids: string[]) => {
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds: ids }),
    });
  }, []);

  const addItem = useCallback(
    async (productId: string, item: Omit<WishlistItem, 'addedAt'>) => {
      const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;

      // Optimistic update
      const newIds = [...productIds, gid];
      setProductIds(newIds);
      setItems((prev) => [...prev, { ...item, addedAt: new Date().toISOString() }]);

      try {
        await saveWishlist(newIds);
      } catch {
        // Rollback
        setProductIds(productIds);
        setItems((prev) => prev.filter((i) => i.productId !== productId));
      }
    },
    [productIds, saveWishlist]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;

      // Optimistic update
      const prevItems = items;
      const prevIds = productIds;
      const newIds = productIds.filter((id) => id !== gid);
      setProductIds(newIds);
      setItems((prev) => prev.filter((i) => i.productId !== productId));

      try {
        await saveWishlist(newIds);
      } catch {
        // Rollback
        setItems(prevItems);
        setProductIds(prevIds);
      }
    },
    [productIds, items, saveWishlist]
  );

  const toggleItem = useCallback(
    async (productId: string, item: Omit<WishlistItem, 'addedAt'>) => {
      const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;
      if (productIds.includes(gid)) {
        await removeItem(productId);
      } else {
        await addItem(productId, item);
      }
    },
    [productIds, addItem, removeItem]
  );

  const isInWishlistFn = useCallback(
    (productId: string) => {
      const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;
      return productIds.includes(gid);
    },
    [productIds]
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        isLoggedIn,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist: isInWishlistFn,
        refreshWishlist,
        count: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
