import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireAdminMutation } from "./lib/admin";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("contactMessages").order("desc").collect();
  },
});

export const get = query({
  args: { messageId: v.id("contactMessages") },
  handler: async (ctx, { messageId }) => {
    await requireAdmin(ctx);
    return await ctx.db.get(messageId);
  },
});

export const markRead = mutation({
  args: { messageId: v.id("contactMessages") },
  handler: async (ctx, { messageId }) => {
    await requireAdminMutation(ctx);

    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    if (!message.readAt) {
      await ctx.db.patch(messageId, { readAt: Date.now() });
    }

    return messageId;
  },
});

export const remove = mutation({
  args: { messageId: v.id("contactMessages") },
  handler: async (ctx, { messageId }) => {
    await requireAdminMutation(ctx);

    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    await ctx.db.delete(messageId);
    return messageId;
  },
});

export const summary = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const messages = await ctx.db
      .query("contactMessages")
      .order("desc")
      .collect();
    const unread = messages.filter((m) => !m.readAt).length;

    return {
      total: messages.length,
      unread,
      recent: messages.slice(0, 8),
    };
  },
});
