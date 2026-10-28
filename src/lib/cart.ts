export interface WeightOption {
  weight: string;
  price: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  image: string;
  /** Default / from-price label shown on the menu card */
  price: string;
  /** Default weight label; weight options override this in the add dialog */
  weight: string;
  /** When set, shoppers pick a size before adding to cart */
  weightOptions?: WeightOption[];
}

export interface CartItem {
  id: number;
  /** Stable cart line key — `${id}::${weight}` so same product, different sizes stay separate */
  lineKey: string;
  name: string;
  price: number;
  priceLabel: string;
  quantity: number;
  image: string;
  weight: string;
}

export function cartLineKey(id: number, weight: string): string {
  return `${id}::${weight}`;
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

/** Menu-card price (uses “From …” when sizes have different prices). */
export function menuDisplayPrice(item: MenuItem): string {
  const options = item.weightOptions;
  if (!options?.length) return item.price;

  const amounts = options.map((option) => parsePrice(option.price));
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  if (min === max) return formatRand(min);
  return `From ${formatRand(min)}`;
}

/** Menu-card weight line for multi-size products. */
export function menuDisplayWeight(item: MenuItem): string {
  const options = item.weightOptions;
  if (!options?.length) return item.weight;
  return options.map((option) => option.weight).join(" / ");
}
