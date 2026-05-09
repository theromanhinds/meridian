import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    folder: v.string(),
    status: v.string(),
    tags: v.array(v.string()),
    wordCount: v.number(),
    lastEditedBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    pinnedAt: v.optional(v.number()),
  }).index("by_folder", ["folder"])
    .index("by_status", ["status"])
    .index("by_updated", ["updatedAt"])
    .index("by_slug", ["slug"]),

  chatSessions: defineTable({
    fileId: v.id("files"),
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number(),
      agentUsed: v.optional(v.string()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_file", ["fileId"]),

  pendingSync: defineTable({
    fileId: v.id("files"),
    operation: v.string(),
    targetPath: v.string(),
    content: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_status", ["status"]),
});
