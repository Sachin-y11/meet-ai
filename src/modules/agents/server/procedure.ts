import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { agentInsertSchema } from "../schema";

export const agentRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const getOneAgent = await prisma.agents.findFirstOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      return getOneAgent;
    }),

  getMany: protectedProcedure.query(async () => {
    const data = await prisma.agents.findMany();

    return data;
  }),

  create: protectedProcedure
    .input(agentInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const createAgent = await prisma.agents.create({
        data: {
          ...input,
          userId: ctx.auth.user.id,
        },
      });

      return createAgent;
    }),

  update: protectedProcedure
    .input(agentInsertSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const result = await prisma.agents.updateMany({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
        data,
      });

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found.",
        });
      }
    }),
});
