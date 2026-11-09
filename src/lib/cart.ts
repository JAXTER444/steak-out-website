export interface ProductOption {
  /** Label shown in the picker (size, marinade, flavour, etc.) */
  label: string;
  /** Price for this option; falls back to the item price */
  price?: string;
  /**
   * Cart/detail line for this option.
   * If omitted, uses `${item.weight} · ${label}` when weight is a single size,
   * otherwise just `label`.
   */
  weight?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  image: string;
  /** Default / from-price label shown on the menu card */
  price: string;
  /** Default weight label; option pickers may override this in the cart */
  weight: string;
  /** Picker heading, e.g. "Weight", "Marinade", "Flavour" */
  optionLabel?: string;
  /** When set, shoppers pick a variant before adding to cart */
  options?: ProductOption[];
}

export interface CartItem {
  id: number;
  /** Stable cart line key — `${id}::${weight}` so variants stay separate */
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

export function optionPrice(item: MenuItem, option: ProductOption): string {
  return option.price ?? item.price;
}

export function optionWeight(item: MenuItem, option: ProductOption): string {
  if (option.weight) return option.weight;
  const base = item.weight.trim();
  if (base && !base.includes("/")) {
    return `${base} · ${option.label}`;
  }
  return option.label;
}

/** Menu-card price (uses “From …” when options have different prices). */
export function menuDisplayPrice(item: MenuItem): string {
  const options = item.options;
  if (!options?.length) return item.price;

  const amounts = options.map((option) => parsePrice(optionPrice(item, option)));
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  if (min === max) return formatRand(min);
  return `From ${formatRand(min)}`;
}

/** Menu-card subtitle for products with selectable options. */
export function menuDisplayWeight(item: MenuItem): string {
  const options = item.options;
  if (!options?.length) return item.weight;
  return options.map((option) => option.label).join(" / ");
}
