import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;

function parseEmailList(envKey: string): string[] {
  const raw = (process.env[envKey] as string | undefined) ?? "";
  return raw
    .split(",")
    .map((email: string) => email.trim().toLowerCase())
    .filter(Boolean);
}

function parseAdminEmails(): string[] {
  return parseEmailList("ADMIN_EMAILS");
}

function parseWorkerEmails(): string[] {
  return parseEmailList("WORKER_EMAILS");
}

function isAdminAllowlisted(email: string | undefined): boolean {
  if (!email) return false;
  return parseAdminEmails().includes(email.trim().toLowerCase());
}

function isWorkerAllowlisted(email: string | undefined): boolean {
  if (!email) return false;
  return parseWorkerEmails().includes(email.trim().toLowerCase());
}

function isAdminUser(user: Doc<"users">): boolean {
  return user.role === "admin" || isAdminAllowlisted(user.email);
}

function isWorkerUser(user: Doc<"users">): boolean {
  return user.role === "worker" || isWorkerAllowlisted(user.email);
}

/** Admin or worker (orders / ops access). */
function isStaffUser(user: Doc<"users">): boolean {
  return isAdminUser(user) || isWorkerUser(user);
}

async function requireAuthenticatedUser(ctx: Ctx): Promise<Doc<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/** Read-only admin check (queries). Does not write role. */
export async function requireAdmin(ctx: Ctx): Promise<Doc<"users">> {
  const user = await requireAuthenticatedUser(ctx);

  if (!isAdminUser(user)) {
    throw new Error("Admin access required");
  }

  return user;
}

/** Mutation-safe: require admin and persist role if allowlisted. */
export async function requireAdminMutation(
  ctx: MutationCtx,
): Promise<Doc<"users">> {
  const user = await requireAdmin(ctx);
  if (user.role !== "admin" && isAdminAllowlisted(user.email)) {
    await ctx.db.patch(user._id, { role: "admin" });
    return { ...user, role: "admin" };
  }
  return user;
}

export async function getAdminUser(
  ctx: Ctx,
): Promise<Doc<"users"> | null> {
  try {
    return await requireAdmin(ctx);
  } catch {
    return null;
  }
}

/** Read-only staff check (admin or worker). Does not write role. */
export async function requireStaff(ctx: Ctx): Promise<Doc<"users">> {
  const user = await requireAuthenticatedUser(ctx);

  if (!isStaffUser(user)) {
    throw new Error("Staff access required");
  }

  return user;
}

/**
 * Mutation-safe staff check. Persists admin/worker role from allowlists.
 * Admin allowlist wins over worker (never downgrade admin).
 */
export async function requireStaffMutation(
  ctx: MutationCtx,
): Promise<Doc<"users">> {
  const user = await requireStaff(ctx);

  if (user.role !== "admin" && isAdminAllowlisted(user.email)) {
    await ctx.db.patch(user._id, { role: "admin" });
    return { ...user, role: "admin" };
  }

  if (
    user.role !== "admin" &&
    user.role !== "worker" &&
    isWorkerAllowlisted(user.email)
  ) {
    await ctx.db.patch(user._id, { role: "worker" });
    return { ...user, role: "worker" };
  }

  return user;
}

export async function getStaffUser(
  ctx: Ctx,
): Promise<Doc<"users"> | null> {
  try {
    return await requireStaff(ctx);
  } catch {
    return null;
  }
}

/**
 * Worker panel gate: allowlisted workers, persisted workers, or admins.
 * Does not grant workers admin-only APIs.
 */
export async function getWorkerPanelUser(
  ctx: Ctx,
): Promise<Doc<"users"> | null> {
  try {
    const user = await requireAuthenticatedUser(ctx);
    if (isAdminUser(user) || isWorkerUser(user)) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
}

/** Persist worker (or admin) role for worker-panel sign-in. */
export async function requireWorkerPanelMutation(
  ctx: MutationCtx,
): Promise<Doc<"users">> {
  const user = await requireAuthenticatedUser(ctx);

  if (isAdminAllowlisted(user.email)) {
    if (user.role !== "admin") {
      await ctx.db.patch(user._id, { role: "admin" });
      return { ...user, role: "admin" };
    }
    return user;
  }

  if (isWorkerAllowlisted(user.email) || user.role === "worker") {
    if (user.role !== "worker" && user.role !== "admin") {
      await ctx.db.patch(user._id, { role: "worker" });
      return { ...user, role: "worker" };
    }
    return user;
  }

  if (user.role === "admin") {
    return user;
  }

  throw new Error("Worker access required");
}
