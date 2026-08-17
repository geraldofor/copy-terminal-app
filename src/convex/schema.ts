import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      blocked: v.optional(v.boolean()), // admin flag: user is blocked from generating

      // copyforge plan/usage fields
      credits: v.optional(v.number()), // remaining generation credits
      creditsTotal: v.optional(v.number()), // total credits on the current plan
      generatedTotal: v.optional(v.number()), // total copies generated (all time)

      // marketing / traffic attribution (set once at signup)
      signupSource: v.optional(v.string()), // utm_source or referrer host, e.g. "google", "instagram.com"
      signupReferrer: v.optional(v.string()), // full referrer URL when available
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // copies saved to the user's history ("Meus Textos Salvos")
    copies: defineTable({
      userId: v.id("users"),
      template: v.string(), // template id (meta-ads, legendas, roteiros, emails)
      title: v.string(), // auto-generated title shown in the library
      content: v.string(), // generated copy text
      input: v.any(), // the briefing values used to generate it
      createdAt: v.number(), // ms timestamp for sorting
    }).index("by_user_created", ["userId", "createdAt"]),

    // Manual payment orders (bridge flow: customer pays → admin confirms → credits)
    manualOrders: defineTable({
      userId: v.id("users"),
      userEmail: v.optional(v.string()), // snapshot for the admin view
      itemType: v.union(v.literal("pack"), v.literal("subscription")),
      itemId: v.string(), // pack id or plan id from packs.ts
      itemName: v.string(), // human label snapshot (e.g. "pack:pro")
      credits: v.number(), // credits granted on confirmation
      amount: v.number(), // amount to pay (numeric)
      currency: v.string(), // "BRL" | "USD"
      reference: v.string(), // human reference code, e.g. CF-AB12CD
      status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("cancelled"),
      ),
      confirmedAt: v.optional(v.number()),
      confirmedBy: v.optional(v.id("users")),
      cancelledAt: v.optional(v.number()),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // App settings (key → value), e.g. manual payment instructions
    settings: defineTable({
      key: v.string(),
      value: v.any(),
    }).index("by_key", ["key"]),

    // PayPal recurring subscriptions (plans from packs.ts)
    subscriptions: defineTable({
      userId: v.id("users"),
      paypalSubscriptionId: v.string(),
      planId: v.string(), // plan id from packs.ts
      cycle: v.union(v.literal("monthly"), v.literal("annual")),
      status: v.string(), // APPROVAL_PENDING | ACTIVE | SUSPENDED | CANCELLED | EXPIRED
      currency: v.string(),
      monthlyCredits: v.number(),
      rolloverCap: v.number(),
      creditsGranted: v.number(), // cycles granted so far
      lastPaymentAt: v.optional(v.number()),
      lastGrantedAt: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_paypal", ["paypalSubscriptionId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
