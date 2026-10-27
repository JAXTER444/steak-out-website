import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

function coAdminDataConfig() {
  const siteUrl = (process.env.CO_ADMIN_SITE_URL ?? "").replace(/\/$/, "");
  const apiKey = process.env.CO_ADMIN_BRIDGE_API_KEY ?? "";
  if (!siteUrl || !apiKey) {
    throw new Error(
      "Co-admin data bridge not configured (CO_ADMIN_SITE_URL / CO_ADMIN_BRIDGE_API_KEY)",
    );
  }
  return { siteUrl, apiKey };
}

async function coFetch(path: string, init?: RequestInit) {
  const { siteUrl, apiKey } = coAdminDataConfig();
  const res = await fetch(`${siteUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { error: text };
  }
  if (!res.ok) {
    const err =
      body && typeof body === "object" && "error" in body
        ? String((body as { error: unknown }).error)
        : `Co-admin data API ${res.status}`;
    throw new Error(err);
  }
  return body;
}

/** Primary admin or co-admin may read/write co-admin ops data. */
async function assertCoAdminPanelAccess(ctx: {
  runQuery: (
    ref: typeof api.admin.me | typeof api.coAdmin.me,
    args: Record<string, never>,
  ) => Promise<unknown>;
}) {
  const primary = await ctx.runQuery(api.admin.me, {});
  if (primary) return;
  const coAdmin = await ctx.runQuery(api.coAdmin.me, {});
  if (!coAdmin) {
    throw new Error("Admin access required");
  }
}

export const getLabour = action({
  args: {},
  handler: async (ctx) => {
    await assertCoAdminPanelAccess(ctx);
    return await coFetch("/co-admin-bridge/labour");
  },
});

export const saveLabour = action({
  args: { storeJson: v.string() },
  handler: async (ctx, args) => {
    await assertCoAdminPanelAccess(ctx);
    return await coFetch("/co-admin-bridge/labour", {
      method: "PUT",
      body: JSON.stringify({ storeJson: args.storeJson }),
    });
  },
});

export const getProductCosts = action({
  args: {},
  handler: async (ctx) => {
    await assertCoAdminPanelAccess(ctx);
    return await coFetch("/co-admin-bridge/product-costs");
  },
});

export const saveProductCosts = action({
  args: { mapJson: v.string() },
  handler: async (ctx, args) => {
    await assertCoAdminPanelAccess(ctx);
    return await coFetch("/co-admin-bridge/product-costs", {
      method: "PUT",
      body: JSON.stringify({ mapJson: args.mapJson }),
    });
  },
});

export const getPriceHistory = action({
  args: {},
  handler: async (ctx) => {
    await assertCoAdminPanelAccess(ctx);
    return await coFetch("/co-admin-bridge/price-history");
  },
});

export const savePriceHistory = action({
  args: { mapJson: v.string() },
  handler: async (ctx, args) => {
    await assertCoAdminPanelAccess(ctx);
    return await coFetch("/co-admin-bridge/price-history", {
      method: "PUT",
      body: JSON.stringify({ mapJson: args.mapJson }),
    });
  },
});
