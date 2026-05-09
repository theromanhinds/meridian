import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const queueWrite = mutation({
  args: {
    fileId: v.id("files"),
    targetPath: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("pendingSync", {
      fileId: args.fileId,
      operation: "write",
      targetPath: args.targetPath,
      content: args.content,
      status: "pending",
      createdAt: Date.now(),
    });
  }
});

export const queueDelete = mutation({
  args: { fileId: v.id("files"), targetPath: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.insert("pendingSync", {
      fileId: args.fileId,
      operation: "delete",
      targetPath: args.targetPath,
      status: "pending",
      createdAt: Date.now(),
    });
  }
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("pendingSync")
      .withIndex("by_status", q => q.eq("status", "pending"))
      .collect();
  }
});

export const markSynced = mutation({
  args: { id: v.id("pendingSync") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "synced" });
  }
});

export const markError = mutation({
  args: { id: v.id("pendingSync"), error: v.optional(v.string()) },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "error" });
  }
});
