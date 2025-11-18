import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { resolveConversation } from "../../tools/resolveConversation";
import { escalateConversation } from "../../tools/escalateConversation";

export const supportAgent = new Agent(components.agent, {
  name: "Trellis Support Agent",
  languageModel: google("gemini-2.5-flash"),
  instructions: `You are a customer support agent for Trellis, a customer support. Use "resolveConversation" tool when user expresses finalization of the conversation. Use "escalateConversation" tool when user expresses frustation, or requests a human operator.`,
  
});
