import prisma from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const agentRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await prisma.agents.findMany();

    return await data;
  }),
});
