import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { menuItems } from "../data/menuItems";
import type { MenuItem } from "../lib/cart";

/**
 * Static catalog with live Convex photo overrides applied.
 * Used by the storefront so admin panel uploads show immediately.
 */
export function useMenuWithImages(): MenuItem[] | undefined {
  const overrides = useQuery(api.productImages.list);

  return useMemo(() => {
    if (overrides === undefined) return undefined;
    if (overrides.length === 0) return menuItems;

    const byId = new Map(
      overrides.map((row) => [row.menuItemId, row.url] as const),
    );

    return menuItems.map((item) => {
      const url = byId.get(item.id);
      return url ? { ...item, image: url } : item;
    });
  }, [overrides]);
}
