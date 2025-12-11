import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { components, internal } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";

// Get multiple conversations for a given contact session with pagination
export const getMany = query({
  args: {
    contactSessionId: v.id("contactSessions"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_contact_session_id", (q) =>
        q.eq("contactSessionId", args.contactSessionId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const conversationWithLastMessage = await Promise.all(
      conversations.page.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;

        const messages = await supportAgent.listMessages(
          ctx,
          {
            threadId: conversation.threadId,
            paginationOpts: {
              numItems: 1,
              cursor: null,
            },
          }
        );

        if (messages.page.length > 0) {
          lastMessage = messages.page[0] ?? null;
        }
        return {
          _id: conversation._id,
          _creationTime: conversation._creationTime,
          status: conversation.status,
          threadId: conversation.threadId,
          organizationId: conversation.organizationId,
          lastMessage,
        };
      })
    );

    return {
      ...conversations,
      page: conversationWithLastMessage,
    };
  },
});

// Get a single conversation by ID, ensuring it belongs to the given contact session
export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.db.get(
      args.conversationId
    );
    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (
      conversation.contactSessionId !==
      args.contactSessionId
    ) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Incorrect session",
      });
    }

    return {
      _id: conversation._id,
      status: conversation.status,
      threadId: conversation.threadId,
    };
  },
});

// Create a new conversation linked to the given contact session and organization
export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    await ctx.runMutation(
      internal.system.contactSessions.refresh,
      {
        contactSessionId: args.contactSessionId,
      }
    );

    const { threadId } = await supportAgent.createThread(
      ctx,
      {
        userId: args.organizationId,
      }
    );

    const widgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();

    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: "assistant",
        content:
          widgetSettings?.greetMessage ||
          "Hello! How can I assist you today?",
      },
    });

    const conversationId = await ctx.db.insert(
      "conversations",
      {
        contactSessionId: session._id,
        status: "unresolved",
        organizationId: args.organizationId,
        threadId: threadId,
      }
    );
    return conversationId;
  },
});
