import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  requireAdmin,
  requireStaff,
  requireStaffMutation,
} from "./lib/admin";

const statusValidator = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("delivered"),
  v.literal("cancelled"),
);

export const listAll = query({
  args: {
    status: v.optional(statusValidator),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);

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

export const get = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    await requireStaff(ctx);
    return await ctx.db.get(orderId);
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: statusValidator,
  },
  handler: async (ctx, { orderId, status }) => {
    await requireStaffMutation(ctx);

    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(orderId, { status });
    return orderId;
  },
});

export const summary = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);

    const orders = await ctx.db.query("orders").order("desc").collect();
    const pending = orders.filter((o) => o.status === "pending").length;
    const confirmed = orders.filter((o) => o.status === "confirmed").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;

    return {
      total: orders.length,
      pending,
      confirmed,
      delivered,
      cancelled,
      recent: orders.slice(0, 8),
    };
  },
});

export const analytics = query({
  args: {
    days: v.optional(v.number()),
    statuses: v.optional(v.array(statusValidator)),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const days = Math.min(Math.max(args.days ?? 30, 7), 90);
    const allStatuses = [
      "pending",
      "confirmed",
      "delivered",
      "cancelled",
    ] as const;
    const selectedStatuses =
      args.statuses && args.statuses.length > 0
        ? new Set(args.statuses)
        : new Set(allStatuses);

    const matchesStatus = (status: (typeof allStatuses)[number]) =>
      selectedStatuses.has(status);

    const orders = await ctx.db.query("orders").collect();
    const now = Date.now();
    const rangeStart = now - days * 24 * 60 * 60 * 1000;
    const inRange = orders.filter(
      (o) => o._creationTime >= rangeStart && matchesStatus(o.status),
    );
    const previousStart = rangeStart - days * 24 * 60 * 60 * 1000;
    const previous = orders.filter(
      (o) =>
        o._creationTime >= previousStart &&
        o._creationTime < rangeStart &&
        matchesStatus(o.status),
    );

    const sumRevenue = (list: typeof orders) =>
      list.reduce((sum, o) => sum + o.total, 0);

    const revenue = sumRevenue(inRange);
    const previousRevenue = sumRevenue(previous);
    const orderCount = inRange.length;
    const previousOrderCount = previous.length;
    const delivered = inRange.filter((o) => o.status === "delivered");
    const cancelled = inRange.filter((o) => o.status === "cancelled");
    const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

    const byStatus = {
      pending: inRange.filter((o) => o.status === "pending").length,
      confirmed: inRange.filter((o) => o.status === "confirmed").length,
      delivered: delivered.length,
      cancelled: cancelled.length,
    };

    const byPayment = {
      eft: inRange.filter((o) => o.paymentMethod === "eft").length,
      cod: inRange.filter((o) => o.paymentMethod === "cod").length,
    };

    // Daily series
    const dayMs = 24 * 60 * 60 * 1000;
    const revenueByDay: { date: string; revenue: number; orders: number }[] =
      [];
    for (let i = days - 1; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setTime(dayStart.getTime() - i * dayMs);
      const dayEnd = dayStart.getTime() + dayMs;
      const dayOrders = inRange.filter(
        (o) =>
          o._creationTime >= dayStart.getTime() && o._creationTime < dayEnd,
      );
      revenueByDay.push({
        date: dayStart.toLocaleDateString("en-ZA", {
          month: "short",
          day: "numeric",
        }),
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      });
    }

    // Top products
    const productMap = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();
    for (const order of inRange) {
      for (const item of order.items) {
        const key = item.name;
        const existing = productMap.get(key) ?? {
          name: item.name,
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
        productMap.set(key, existing);
      }
    }
    const topProducts = [...productMap.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    const pctChange = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - prev) / prev) * 1000) / 10;
    };

    return {
      days,
      statuses: [...selectedStatuses],
      kpis: {
        revenue,
        revenueChange: pctChange(revenue, previousRevenue),
        orders: orderCount,
        ordersChange: pctChange(orderCount, previousOrderCount),
        avgOrderValue,
        delivered: delivered.length,
        cancelled: cancelled.length,
        fulfillmentRate:
          orderCount > 0
            ? Math.round((delivered.length / orderCount) * 1000) / 10
            : 0,
      },
      byStatus,
      byPayment,
      revenueByDay,
      topProducts,
    };
  },
});

/** Daily sold qty + average selling price per menu item (for product charts). */
export const productTimeSeries = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const days = Math.min(Math.max(args.days ?? 30, 7), 90);
    const orders = await ctx.db.query("orders").collect();
    const now = Date.now();
    const rangeStart = now - days * 24 * 60 * 60 * 1000;
    const inRange = orders.filter(
      (o) =>
        o._creationTime >= rangeStart && o.status !== "cancelled",
    );

    const dayMs = 24 * 60 * 60 * 1000;
    const dayStarts: number[] = [];
    const dayLabels: string[] = [];
    const dayIsos: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setTime(dayStart.getTime() - i * dayMs);
      dayStarts.push(dayStart.getTime());
      dayLabels.push(
        dayStart.toLocaleDateString("en-ZA", {
          month: "short",
          day: "numeric",
        }),
      );
      const yyyy = dayStart.getFullYear();
      const mm = String(dayStart.getMonth() + 1).padStart(2, "0");
      const dd = String(dayStart.getDate()).padStart(2, "0");
      dayIsos.push(`${yyyy}-${mm}-${dd}`);
    }

    type Agg = { qty: number; revenue: number; name: string };
    const byProductDay = new Map<string, Agg>();

    for (const order of inRange) {
      const dayIndex = dayStarts.findIndex((start) => {
        const end = start + dayMs;
        return order._creationTime >= start && order._creationTime < end;
      });
      if (dayIndex < 0) continue;

      for (const item of order.items) {
        const key = `${item.menuItemId}::${dayIndex}`;
        const existing = byProductDay.get(key) ?? {
          qty: 0,
          revenue: 0,
          name: item.name,
        };
        existing.qty += item.quantity;
        existing.revenue += item.price * item.quantity;
        existing.name = item.name;
        byProductDay.set(key, existing);
      }
    }

    const productIds = new Set<number>();
    const names = new Map<number, string>();
    for (const key of byProductDay.keys()) {
      const id = Number(key.split("::")[0]);
      productIds.add(id);
      const agg = byProductDay.get(key)!;
      names.set(id, agg.name);
    }

    const products = [...productIds].map((menuItemId) => {
      const points = dayStarts.map((_, dayIndex) => {
        const agg = byProductDay.get(`${menuItemId}::${dayIndex}`);
        if (!agg || agg.qty <= 0) {
          return {
            qtySold: 0,
            avgSellPrice: null as number | null,
            revenue: 0,
          };
        }
        return {
          qtySold: agg.qty,
          avgSellPrice: Math.round((agg.revenue / agg.qty) * 100) / 100,
          revenue: Math.round(agg.revenue * 100) / 100,
        };
      });
      return {
        menuItemId,
        name: names.get(menuItemId) ?? `Item ${menuItemId}`,
        points,
      };
    });

    return { days, dayLabels, dayIsos, products };
  },
});
