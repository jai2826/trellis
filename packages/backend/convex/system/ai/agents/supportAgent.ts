import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "Trellis Support Agent",
  languageModel: google("gemini-2.5-flash"),
  instructions:
    "You are a customer support agent for Trellis, a customer support ",
});
