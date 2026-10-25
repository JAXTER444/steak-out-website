import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const orderItemValidator = v.object({
  menuItemId: v.number(),
  name: v.string(),
  price: v.number(),
  priceLabel: v.string(),
  quantity: v.number(),
  image: v.string(),
  weight: v.string(),
});

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),

  orders: defineTable({
    userId: v.optional(v.id("users")),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("delivered"),
      v.literal("cancelled"),
    ),
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
  })
    .index("by_user", ["userId"])
    .index("by_email", ["customerEmail"]),

  contactMessages: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  }),
});

export default schema;
