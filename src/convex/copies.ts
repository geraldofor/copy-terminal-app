import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

/**
 * List all saved copies for the current user, newest first.
 */
export const listCopies = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      return [];
    }
    return await ctx.db
      .query("copies")
      .withIndex("by_user_created", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

/**
 * Save a generated copy into the user's history.
 */
export const saveCopy = mutation({
  args: {
    template: v.string(),
    title: v.string(),
    content: v.string(),
    input: v.any(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    if (user.blocked) {
      throw new ConvexError("Conta bloqueada. Entre em contato com o suporte.");
    }
    return await ctx.db.insert("copies", {
      userId: user._id,
      template: args.template,
      title: args.title,
      content: args.content,
      input: args.input,
      createdAt: Date.now(),
    });
  },
});

/**
 * Delete a saved copy. Only the owner can delete it.
 */
export const deleteCopy = mutation({
  args: { id: v.id("copies") },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const copy = await ctx.db.get(id);
    if (copy === null || copy.userId !== user._id) {
      throw new ConvexError("Copy não encontrada.");
    }
    await ctx.db.delete(id);
  },
});
