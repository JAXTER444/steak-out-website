import { mutation, query } from "./_generated/server";
import {
  getWorkerPanelUser,
  requireWorkerPanelMutation,
} from "./lib/admin";

/** Current user if they can use the worker panel (worker or admin). */
export const me = query({
  args: {},
  handler: async (ctx) => {
    return await getWorkerPanelUser(ctx);
  },
});

/** Persist role: "worker" (or "admin") for allowlisted emails after login. */
export const ensureRole = mutation({
  args: {},
  handler: async (ctx) => {
    return await requireWorkerPanelMutation(ctx);
  },
});
