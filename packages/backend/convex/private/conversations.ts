import { MessageDoc } from "@convex-dev/agent";
import {
  paginationOptsValidator,
  PaginationResult,
} from "convex/server";
import { ConvexError, v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { supportAgent } from "../system/ai/agents/supportAgent";

// Get many conversations for the authenticated user's organization
export const getMany = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(
      v.union(
        v.literal("unresolved"),
        v.literal("resolved"),
        v.literal("escalated")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }
    const orgId = identity.orgId as string;
    if (orgId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    let conversations: PaginationResult<
      Doc<"conversations">
    >;

    if (args.status) {
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_status_and_organization_id", (q) =>
          q
            .eq(
              "status",
              args.status as
                | "unresolved"
                | "escalated"
                | "resolved"
            )
            .eq("organizationId", orgId)
        )
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_organization_id", (q) =>
          q.eq("organizationId", orgId)
        )
        .order("desc")
        .paginate(args.paginationOpts);
    }

    const conversationWithAdditionalInfo =
      await Promise.all(
        conversations.page.map(async (conversation) => {
          let lastMessage: MessageDoc | null = null;
          const contactSession = await ctx.db.get(
            conversation.contactSessionId
          );

          if (!contactSession) {
            return null;
          }

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
            ...conversation,
            lastMessage,
            contactSession,
          };
        })
      );

    const validConversations =
      conversationWithAdditionalInfo.filter(
        (conv): conv is NonNullable<typeof conv> =>
          conv !== null
      );
    return {
      ...conversations,
      page: validConversations,
    };
  },
});



// // Get a single conversation by ID, ensuring it belongs to the given contact session
// export const getOne = query({
//   args: {
//     conversationId: v.id("conversations"),
//     contactSessionId: v.id("contactSessions"),
//   },
//   handler: async (ctx, args) => {
//     const session = await ctx.db.get(args.contactSessionId);
//     if (!session || session.expiresAt < Date.now()) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Invalid session",
//       });
//     }

//     const conversation = await ctx.db.get(
//       args.conversationId
//     );
//     if (!conversation) {
//       throw new ConvexError({
//         code: "NOT_FOUND",
//         message: "Conversation not found",
//       });
//     }

//     if (
//       conversation.contactSessionId !==
//       args.contactSessionId
//     ) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Incorrect session",
//       });
//     }

//     return {
//       _id: conversation._id,
//       status: conversation.status,
//       threadId: conversation.threadId,
//     };
//   },
// });

// // Create a new conversation linked to the given contact session and organization
// export const create = mutation({
//   args: {
//     organizationId: v.string(),
//     contactSessionId: v.id("contactSessions"),
//   },
//   handler: async (ctx, args) => {
//     const session = await ctx.db.get(args.contactSessionId);
//     if (!session || session.expiresAt < Date.now()) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Invalid session",
//       });
//     }

//     const { threadId } = await supportAgent.createThread(
//       ctx,
//       {
//         userId: args.organizationId,
//       }
//     );

//     await saveMessage(ctx, components.agent, {
//       threadId,
//       message: {
//         role: "assistant",
//         content: "Hello! How can I assist you today?",
//       },
//     });

//     const conversationId = await ctx.db.insert(
//       "conversations",
//       {
//         contactSessionId: session._id,
//         status: "unresolved",
//         organizationId: args.organizationId,
//         threadId: threadId,
//       }
//     );
//     return conversationId;
//   },
// });
