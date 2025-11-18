// convex/convex.config.ts
import agent from "@convex-dev/agent/convex.config";
import { defineApp } from "convex/server";
import rag from "@convex-dev/rag/convex.config.js";

const app = defineApp();
app.use(agent);
app.use(rag);

export default app;
