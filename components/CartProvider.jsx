'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CartCtx = createContext({
  items: [], add: () => {}, remove: () => {}, update: () => {}, clear: () => {}, total: 0,
});

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('peptx_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        const valid = Array.isArray(parsed)
          ? parsed.filter(i => i.key && i.sku && typeof i.unitPrice === 'number' && typeof i.count === 'number')
          : [];
        setItems(valid);
      }
    } catch {}
  }, []);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem('peptx_cart', JSON.stringify(next));
  };

  const add = (product, qty, unitPrice) => {
    setItems(prev => {
      const key = `${product.sku}-${qty}`;
      const existing = prev.find(i => i.key === key);
      const next = existing
        ? prev.map(i => i.key === key ? { ...i, count: i.count + 1 } : i)
        : [...prev, { key, sku: product.sku, name: product.name, dose: product.dose, qty, unitPrice, count: 1 }];
      localStorage.setItem('peptx_cart', JSON.stringify(next));
      return next;
    });
  };

  const remove = (key) => persist(items.filter(i => i.key !== key));

  const update = (key, count) => {
    if (count <= 0) return remove(key);
    persist(items.map(i => i.key === key ? { ...i, count } : i));
  };

  const clear = () => persist([]);

  const total = items.reduce((s, i) => s + i.unitPrice * i.count, 0);

  return (
    <CartCtx.Provider value={{ items, add, remove, update, clear, total }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
