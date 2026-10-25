import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const orderItemValidator = v.object({
  menuItemId: v.number(),
  name: v.string(),
  price: v.number(),
  priceLabel: v.string(),
  quantity: v.number(),
  image: v.string(),
  weight: v.string(),
});

export const create = mutation({
  args: {
    paymentMethod: v.union(v.literal("cod"), v.literal("eft")),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    deliveryAddress: v.string(),
    deliveryNotes: v.optional(v.string()),
    items: v.array(orderItemValidator),
    subtotal: v.number(),
    vat: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0) {
      throw new Error("Cannot place an order with no items.");
    }

    const userId = await getAuthUserId(ctx);

    const orderId = await ctx.db.insert("orders", {
      userId: userId ?? undefined,
      status: "pending",
      paymentMethod: args.paymentMethod,
      customerName: args.customerName.trim(),
      customerEmail: args.customerEmail.trim().toLowerCase(),
      customerPhone: args.customerPhone.trim(),
      deliveryAddress: args.deliveryAddress.trim(),
      deliveryNotes: args.deliveryNotes?.trim() || undefined,
      items: args.items,
      subtotal: args.subtotal,
      vat: args.vat,
      deliveryFee: args.deliveryFee,
      total: args.total,
    });

    return orderId;
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    const order = await ctx.db.get(orderId);
    if (!order) {
      return null;
    }

    const userId = await getAuthUserId(ctx);
    if (userId !== null && order.userId === userId) {
      return order;
    }

    return null;
  },
});
