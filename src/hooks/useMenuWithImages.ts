import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { menuItems } from "../data/menuItems";
import {
  formatRand,
  parsePrice,
  type MenuItem,
  type WeightOption,
} from "../lib/cart";

/**
 * Scale multi-size prices so the cheapest option matches `newMinPrice`.
 * Keeps relative gaps between sizes (e.g. fruit cake 500g / 1kg / 1.5kg).
 */
function scaleWeightOptions(
  options: WeightOption[],
  newMinPrice: number,
): WeightOption[] {
  const amounts = options.map((option) => parsePrice(option.price));
  const oldMin = Math.min(...amounts);
  if (!(oldMin > 0) || !Number.isFinite(oldMin)) {
    return options.map((option) => ({
      ...option,
      price: formatRand(newMinPrice),
    }));
  }

  const scale = newMinPrice / oldMin;
  return options.map((option, index) => ({
    ...option,
    price: formatRand(Math.round(amounts[index]! * scale * 100) / 100),
  }));
}

/**
 * Static catalog with live Convex photo + price overrides applied.
 * Used by the storefront so admin panel changes show immediately.
 */
export function useMenuWithImages(): MenuItem[] | undefined {
  const imageOverrides = useQuery(api.productImages.list);
  const priceOverrides = useQuery(api.productPrices.list);

  return useMemo(() => {
    if (imageOverrides === undefined || priceOverrides === undefined) {
      return undefined;
    }

    const imageById = new Map(
      imageOverrides.map((row) => [row.menuItemId, row.url] as const),
    );
    const priceById = new Map(
      priceOverrides.map((row) => [row.menuItemId, row.price] as const),
    );

    if (imageById.size === 0 && priceById.size === 0) {
      return menuItems;
    }

    return menuItems.map((item) => {
      const image = imageById.get(item.id);
      const price = priceById.get(item.id);
      if (image === undefined && price === undefined) return item;

      const next: MenuItem = { ...item };
      if (image !== undefined) {
        next.image = image;
      }
      if (price !== undefined) {
        next.price = formatRand(price);
        if (item.weightOptions?.length) {
          next.weightOptions = scaleWeightOptions(item.weightOptions, price);
        }
      }
      return next;
    });
  }, [imageOverrides, priceOverrides]);
}
