import { google } from "@ai-sdk/google";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";
import rag from "../rag";
import { SEARCH_INTERPRETER_PROMPT } from "../constant";

export const search = createTool({
  description:
    "Search internal knowledge base for relevant information to help answer user questions.",
  args: z.object({
    query: z
      .string()
      .describe(
        "The search query to find relevant information"
      ),
  }),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }
    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: ctx.threadId,
      }
    );
    if (!conversation) {
      return "Conversation not found";
    }

    const orgId = conversation.organizationId;
    const searchResults = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    });

    // if (
    //   !searchResults ||
    //   searchResults.entries.length === 0
    // ) {
    //   return "No relevant information found in the knowledge base.";
    // }
    // console.log("\nSearch Results:", searchResults);

    const contextText = `Found results in ${searchResults.entries
      .map((e) => e.title || null)
      .filter((t) => t !== null)
      .join(
        ", "
      )}. Here is the context: \n\n${searchResults.text}`;

    const response = await generateText({
      messages: [
        {
          role: "system",
          content: SEARCH_INTERPRETER_PROMPT,
        },
        {
          role: "user",
          content: `User asked: "${args.query}"\n\nSearch Results: ${contextText}`,
        },
      ],
      model: google.chat("gemini-2.5-flash"),
    });
    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: response.text,
      },
    });
    return response.text;
  },
});
