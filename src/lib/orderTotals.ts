import type { CartItem } from "./cart";
import { formatRand } from "./cart";

export interface OrderTotals {
  subtotal: number;
  vat: number;
  delivery: number;
  total: number;
}

export function computeOrderTotals(items: CartItem[]): OrderTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = 0;
  const delivery = subtotal === 0 || subtotal >= 1000 ? 0 : 75;
  const total = subtotal + delivery;
  return { subtotal, vat, delivery, total };
}

export { formatRand };
