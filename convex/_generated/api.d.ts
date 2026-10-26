/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as adminContact from "../adminContact.js";
import type * as adminOrders from "../adminOrders.js";
import type * as auth from "../auth.js";
import type * as contact from "../contact.js";
import type * as http from "../http.js";
import type * as invoiceEmail from "../invoiceEmail.js";
import type * as lib_admin from "../lib/admin.js";
import type * as managementBridge from "../managementBridge.js";
import type * as managementHttp from "../managementHttp.js";
import type * as orders from "../orders.js";
import type * as users from "../users.js";
import type * as worker from "../worker.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  adminContact: typeof adminContact;
  adminOrders: typeof adminOrders;
  auth: typeof auth;
  contact: typeof contact;
  http: typeof http;
  invoiceEmail: typeof invoiceEmail;
  "lib/admin": typeof lib_admin;
  managementBridge: typeof managementBridge;
  managementHttp: typeof managementHttp;
  orders: typeof orders;
  users: typeof users;
  worker: typeof worker;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
