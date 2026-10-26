import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

function assertManagementKey(request: Request): void {
  const expected = process.env.MANAGEMENT_API_KEY;
  if (!expected) {
    throw new Error("MANAGEMENT_API_KEY is not configured");
  }
  const header = request.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== expected) {
    throw new Error("Unauthorized");
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function errorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : "Server error";
  const status =
    message === "Unauthorized"
      ? 401
      : message.includes("not configured")
        ? 503
        : message === "Order not found"
          ? 404
          : 500;
  return json({ error: message }, status);
}

const statusValidator = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("delivered"),
  v.literal("cancelled"),
);

export const listOrdersInternal = internalQuery({
  args: {
    status: v.optional(statusValidator),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const getOrderInternal = internalQuery({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    return await ctx.db.get(orderId);
  },
});

export const summaryInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      recent: orders.slice(0, 8),
    };
  },
});

export const updateStatusInternal = internalMutation({
  args: {
    orderId: v.id("orders"),
    status: statusValidator,
  },
  handler: async (ctx, { orderId, status }) => {
    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    await ctx.db.patch(orderId, { status });
    return orderId;
  },
});

export const managementApi = {
  summary: httpAction(async (ctx, request) => {
    try {
      assertManagementKey(request);
      const data = await ctx.runQuery(
        internal.managementHttp.summaryInternal,
        {},
      );
      return json(data);
    } catch (err) {
      return errorResponse(err);
    }
  }),

  list: httpAction(async (ctx, request) => {
    try {
      assertManagementKey(request);
      const url = new URL(request.url);
      const status = url.searchParams.get("status") as
        | "pending"
        | "confirmed"
        | "delivered"
        | "cancelled"
        | null;
      const data = await ctx.runQuery(internal.managementHttp.listOrdersInternal, {
        status: status ?? undefined,
      });
      return json(data);
    } catch (err) {
      return errorResponse(err);
    }
  }),

  get: httpAction(async (ctx, request) => {
    try {
      assertManagementKey(request);
      const url = new URL(request.url);
      const orderId = url.searchParams.get("id");
      if (!orderId) {
        return json({ error: "Missing order id" }, 400);
      }
      const data = await ctx.runQuery(internal.managementHttp.getOrderInternal, {
        orderId: orderId as never,
      });
      if (!data) {
        return json({ error: "Order not found" }, 404);
      }
      return json(data);
    } catch (err) {
      return errorResponse(err);
    }
  }),

  updateStatus: httpAction(async (ctx, request) => {
    try {
      assertManagementKey(request);
      const body = (await request.json()) as {
        orderId?: string;
        status?: string;
      };
      if (!body.orderId || !body.status) {
        return json({ error: "orderId and status required" }, 400);
      }
      const data = await ctx.runMutation(
        internal.managementHttp.updateStatusInternal,
        {
          orderId: body.orderId as never,
          status: body.status as
            | "pending"
            | "confirmed"
            | "delivered"
            | "cancelled",
        },
      );
      return json({ orderId: data });
    } catch (err) {
      return errorResponse(err);
    }
  }),

  menuPrices: httpAction(async (_ctx, request) => {
    try {
      assertManagementKey(request);
      // Prices live in the storefront menu data; management panel vendors a copy.
      // This endpoint acknowledges the bridge and can be extended later.
      return json({ source: "storefront-menu", note: "use panel catalog" });
    } catch (err) {
      return errorResponse(err);
    }
  }),
};
