import {
  modifyAccountCredentials,
  retrieveAccount,
} from "@convex-dev/auth/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";
import {
  getAdminUser,
  requirePrimaryAdminMutation,
} from "./lib/admin";

/** Current user if they are a primary admin (role or ADMIN_EMAILS). */
export const me = query({
  args: {},
  handler: async (ctx) => {
    return await getAdminUser(ctx);
  },
});

/** Persist role: "admin" for allowlisted emails after login. */
export const ensureRole = mutation({
  args: {},
  handler: async (ctx) => {
    return await requirePrimaryAdminMutation(ctx);
  },
});

/** Change password for the signed-in admin (email/password account). */
export const changePassword = action({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { currentPassword, newPassword }) => {
    const admin = await ctx.runQuery(api.admin.me);
    if (!admin?.email) {
      throw new Error("Admin access required");
    }
    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    if (currentPassword === newPassword) {
      throw new Error("New password must be different");
    }

    const email = admin.email.trim().toLowerCase();
    try {
      await retrieveAccount(ctx, {
        provider: "password",
        account: { id: email, secret: currentPassword },
      });
    } catch {
      throw new Error("Current password is incorrect");
    }

    await modifyAccountCredentials(ctx, {
      provider: "password",
      account: { id: email, secret: newPassword },
    });

    return { ok: true as const };
  },
});
