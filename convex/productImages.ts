import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requirePrimaryAdminMutation } from "./lib/admin";

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/** Public: storefront + panels resolve override URLs for menu photos. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("productImages").collect();
    const result: Array<{
      menuItemId: number;
      url: string;
      storageId: string;
    }> = [];

    for (const row of rows) {
      const url = await ctx.storage.getUrl(row.storageId);
      if (!url) continue;
      result.push({
        menuItemId: row.menuItemId,
        url,
        storageId: row.storageId,
      });
    }

    return result;
  },
});

/** Admin-only short-lived upload URL for product photos. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requirePrimaryAdminMutation(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/** Save an uploaded storage file as the live product photo on the website. */
export const setImage = mutation({
  args: {
    menuItemId: v.number(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { menuItemId, storageId }) => {
    await requirePrimaryAdminMutation(ctx);

    if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
      throw new Error("Invalid product id");
    }

    const meta = await ctx.db.system.get("_storage", storageId);
    if (!meta) {
      throw new Error("Uploaded file not found");
    }
    if (meta.contentType && !ALLOWED_CONTENT_TYPES.has(meta.contentType)) {
      await ctx.storage.delete(storageId);
      throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed");
    }
    // Soft size cap (~8 MiB) to keep storefront payloads reasonable
    if (typeof meta.size === "number" && meta.size > 8 * 1024 * 1024) {
      await ctx.storage.delete(storageId);
      throw new Error("Image must be 8MB or smaller");
    }

    const existing = await ctx.db
      .query("productImages")
      .withIndex("by_menu_item", (q) => q.eq("menuItemId", menuItemId))
      .unique();

    if (existing) {
      const oldId = existing.storageId;
      await ctx.db.patch(existing._id, {
        storageId,
        updatedAt: Date.now(),
      });
      if (oldId !== storageId) {
        try {
          await ctx.storage.delete(oldId);
        } catch {
          /* orphan cleanup best-effort */
        }
      }
      return existing._id;
    }

    return await ctx.db.insert("productImages", {
      menuItemId,
      storageId,
      updatedAt: Date.now(),
    });
  },
});

/** Remove override so the static storefront menu image is used again. */
export const clearImage = mutation({
  args: {
    menuItemId: v.number(),
  },
  handler: async (ctx, { menuItemId }) => {
    await requirePrimaryAdminMutation(ctx);

    const existing = await ctx.db
      .query("productImages")
      .withIndex("by_menu_item", (q) => q.eq("menuItemId", menuItemId))
      .unique();

    if (!existing) return null;

    await ctx.db.delete(existing._id);
    try {
      await ctx.storage.delete(existing.storageId);
    } catch {
      /* orphan cleanup best-effort */
    }
    return existing._id;
  },
});
