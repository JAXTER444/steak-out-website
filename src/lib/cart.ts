export interface MenuItem {
  id: number;
  name: string;
  category: string;
  image: string;
  price: string;
  weight: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  priceLabel: string;
  quantity: number;
  image: string;
  weight: string;
}

export function parsePrice(price: string): number {
  const numeric = price.replace(/[^0-9.]/g, "");
  return Number.parseFloat(numeric) || 0;
}

export function formatRand(amount: number): string {
  if (Number.isInteger(amount)) {
    return `R${amount}`;
  }
  return `R${amount.toFixed(2)}`;
}
