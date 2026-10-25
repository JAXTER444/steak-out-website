import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const submit = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const firstName = args.firstName.trim();
    const lastName = args.lastName.trim();
    const email = args.email.trim().toLowerCase();
    const subject = args.subject.trim();
    const message = args.message.trim();

    if (!firstName || !lastName || !email || !subject || !message) {
      throw new Error("Please fill in all required fields.");
    }

    await ctx.db.insert("contactMessages", {
      firstName,
      lastName,
      email,
      phone: args.phone?.trim() || undefined,
      subject,
      message,
    });
  },
});
