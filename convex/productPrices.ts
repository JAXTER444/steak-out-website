import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requirePrimaryAdminMutation } from "./lib/admin";

/** Public: storefront + panels read live menu price overrides. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("productPrices").collect();
    return rows.map((row) => ({
      menuItemId: row.menuItemId,
      price: row.price,
      updatedAt: row.updatedAt,
    }));
  },
});

/** Set the live website price for a catalog product (ZAR). */
export const setPrice = mutation({
  args: {
    menuItemId: v.number(),
    price: v.number(),
  },
  handler: async (ctx, { menuItemId, price }) => {
    await requirePrimaryAdminMutation(ctx);

    if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
      throw new Error("Invalid product id");
    }
    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("Price must be greater than 0");
    }
    if (price > 1_000_000) {
      throw new Error("Price is too large");
    }

    const rounded = Math.round(price * 100) / 100;

    const existing = await ctx.db
      .query("productPrices")
      .withIndex("by_menu_item", (q) => q.eq("menuItemId", menuItemId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        price: rounded,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("productPrices", {
      menuItemId,
      price: rounded,
      updatedAt: Date.now(),
    });
  },
});

/** Remove override so the static storefront menu price is used again. */
export const clearPrice = mutation({
  args: {
    menuItemId: v.number(),
  },
  handler: async (ctx, { menuItemId }) => {
    await requirePrimaryAdminMutation(ctx);

    const existing = await ctx.db
      .query("productPrices")
      .withIndex("by_menu_item", (q) => q.eq("menuItemId", menuItemId))
      .unique();

    if (!existing) return null;

    await ctx.db.delete(existing._id);
    return existing._id;
  },
});
