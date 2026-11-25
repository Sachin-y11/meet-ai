import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { agentInsertSchema } from "../schema";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";

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

  getMany: protectedProcedure
    .input(
      z
        .object({
          page: z.number().int().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
          pageSize: z
            .number()
            .int()
            .min(MIN_PAGE_SIZE)
            .max(MAX_PAGE_SIZE)
            .default(DEFAULT_PAGE_SIZE),
          search: z.string().nullish(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? DEFAULT_PAGE;
      const pageSize = input?.pageSize ?? DEFAULT_PAGE_SIZE;
      const search = input?.search?.trim();

      const where = {
        userId: ctx.auth.user.id,
        ...(search
          ? {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            }
          : {}),
      };

      const [data, total] = await Promise.all([
        prisma.agents.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        }),
        prisma.agents.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
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
