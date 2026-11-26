import { agentRouter } from "@/modules/agents/server/procedure";
import { createTRPCRouter } from "../init";
import { meetingRouter } from "@/modules/meetings/server/procedure";

export const appRouter = createTRPCRouter({
  agents: agentRouter,
  meetings: meetingRouter,
});

export type AppRouter = typeof appRouter;
