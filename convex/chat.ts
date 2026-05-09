import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByFile = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    return ctx.db.query("chatSessions")
      .withIndex("by_file", q => q.eq("fileId", fileId))
      .unique();
  }
});

export const addMessage = mutation({
  args: {
    fileId: v.id("files"),
    role: v.string(),
    content: v.string(),
    agentUsed: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db.query("chatSessions")
      .withIndex("by_file", q => q.eq("fileId", args.fileId))
      .unique();

    const newMessage = {
      role: args.role,
      content: args.content,
      timestamp: now,
      agentUsed: args.agentUsed,
    };

    if (existing) {
      await ctx.db.patch(existing._id, {
        messages: [...existing.messages, newMessage],
        updatedAt: now,
      });
      return existing._id;
    } else {
      return ctx.db.insert("chatSessions", {
        fileId: args.fileId,
        messages: [newMessage],
        createdAt: now,
        updatedAt: now,
      });
    }
  }
});

export const clearSession = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    const existing = await ctx.db.query("chatSessions")
      .withIndex("by_file", q => q.eq("fileId", fileId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { messages: [], updatedAt: Date.now() });
    }
  }
});

export const saveAsNote = mutation({
  args: { fileId: v.id("files"), title: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db.query("chatSessions")
      .withIndex("by_file", q => q.eq("fileId", args.fileId))
      .unique();
    if (!session) return null;

    const content = session.messages
      .map(m => `**${m.role === "user" ? "You" : "Roman II"}:** ${m.content}`)
      .join("\n\n");

    const slug = args.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const now = Date.now();
    return ctx.db.insert("files", {
      title: args.title,
      slug,
      content: `# ${args.title}\n\n${content}`,
      folder: "notes",
      status: "draft",
      tags: ["chat-export"],
      wordCount: content.split(/\s+/).filter(Boolean).length,
      lastEditedBy: "user",
      createdAt: now,
      updatedAt: now,
    });
  }
});
