import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

function managementConfig() {
  const siteUrl = (process.env.MANAGEMENT_SITE_URL ?? "").replace(/\/$/, "");
  const apiKey = process.env.ADMIN_BRIDGE_API_KEY ?? "";
  if (!siteUrl || !apiKey) {
    throw new Error(
      "Management bridge not configured (MANAGEMENT_SITE_URL / ADMIN_BRIDGE_API_KEY)",
    );
  }
  return { siteUrl, apiKey };
}

async function mgmtFetch(path: string, init?: RequestInit) {
  const { siteUrl, apiKey } = managementConfig();
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
        : `Management API ${res.status}`;
    throw new Error(err);
  }
  return body;
}

async function assertAdmin(ctx: {
  runQuery: (
    ref: typeof api.admin.me,
    args: Record<string, never>,
  ) => Promise<unknown>;
}) {
  const me = await ctx.runQuery(api.admin.me, {});
  if (!me) {
    throw new Error("Admin access required");
  }
}

export const getInventory = action({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    return await mgmtFetch("/admin-bridge/inventory");
  },
});

export const saveInventory = action({
  args: {
    mapJson: v.string(),
    historyJson: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    return await mgmtFetch("/admin-bridge/inventory", {
      method: "PUT",
      body: JSON.stringify({
        mapJson: args.mapJson,
        historyJson: args.historyJson,
      }),
    });
  },
});

export const getProductCosts = action({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    return await mgmtFetch("/admin-bridge/product-costs");
  },
});

export const saveProductCosts = action({
  args: { mapJson: v.string() },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    return await mgmtFetch("/admin-bridge/product-costs", {
      method: "PUT",
      body: JSON.stringify({ mapJson: args.mapJson }),
    });
  },
});
