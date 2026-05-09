import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listByFolder = query({
  args: { folder: v.optional(v.string()) },
  handler: async (ctx, { folder }) => {
    if (folder) {
      return ctx.db.query("files")
        .withIndex("by_folder", q => q.eq("folder", folder))
        .order("desc")
        .collect();
    }
    return ctx.db.query("files").order("desc").collect();
  }
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db.query("files")
      .withIndex("by_slug", q => q.eq("slug", slug))
      .unique();
  }
});

export const getById = query({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  }
});

export const create = mutation({
  args: {
    title: v.string(),
    folder: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const slug = slugify(args.title) + "-" + Date.now();
    const now = Date.now();
    return ctx.db.insert("files", {
      title: args.title,
      slug,
      content: args.content ?? `# ${args.title}\n\n`,
      folder: args.folder,
      status: "draft",
      tags: [],
      wordCount: 0,
      lastEditedBy: "user",
      createdAt: now,
      updatedAt: now,
    });
  }
});

export const updateContent = mutation({
  args: {
    id: v.id("files"),
    content: v.string(),
    lastEditedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const title = extractTitle(args.content);
    const wordCount = countWords(args.content);
    await ctx.db.patch(args.id, {
      content: args.content,
      title,
      wordCount,
      lastEditedBy: args.lastEditedBy ?? "user",
      updatedAt: Date.now(),
    });
  }
});

export const updateStatus = mutation({
  args: { id: v.id("files"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status, updatedAt: Date.now() });
  }
});

export const togglePin = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    const file = await ctx.db.get(id);
    if (!file) return;
    await ctx.db.patch(id, {
      pinnedAt: file.pinnedAt ? undefined : Date.now(),
      updatedAt: Date.now(),
    });
  }
});

export const remove = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { folder: "archive", updatedAt: Date.now() });
  }
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, { query: q }) => {
    const all = await ctx.db.query("files").collect();
    const lower = q.toLowerCase();
    return all.filter(f =>
      f.title.toLowerCase().includes(lower) ||
      f.content.toLowerCase().includes(lower)
    ).slice(0, 20);
  }
});

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

function countWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}
