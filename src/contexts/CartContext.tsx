import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, MenuItem } from "../lib/cart";
import { cartLineKey, parsePrice } from "../lib/cart";

const STORAGE_KEY = "steakout-cart";

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  addItem: (item: MenuItem, quantity: number) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  removeItem: (lineKey: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function normalizeCartItem(item: CartItem & { lineKey?: string }): CartItem {
  return {
    ...item,
    lineKey: item.lineKey ?? cartLineKey(item.id, item.weight),
  };
}

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeCartItem);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: MenuItem, quantity: number) => {
    const price = parsePrice(item.price);
    const lineKey = cartLineKey(item.id, item.weight);
    setItems((current) => {
      const existing = current.find((cartItem) => cartItem.lineKey === lineKey);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.lineKey === lineKey
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        );
      }
      return [
        ...current,
        {
          id: item.id,
          lineKey,
          name: item.name,
          price,
          priceLabel: item.price,
          quantity,
          image: item.image,
          weight: item.weight,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) => (item.lineKey === lineKey ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((lineKey: string) => {
    setItems((current) => current.filter((item) => item.lineKey !== lineKey));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalQuantity,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, totalQuantity, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
