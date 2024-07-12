import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const journalingRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        mood: z.string(),
        keyTakeaway: z.string(),
        wordAffirmation: z.string(),
        chat: z.array(
          z.object({
            role: z.enum(["human", "ai"]),
            content: z.string(),
          }),
        ),
        type: z.enum(["CBT", "ZEN"]),
        actionableItems: z.array(z.string()).length(3),
        summary: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.journaling.create({
        data: {
          userId: ctx.session.userId,
          // userId: ctx.session.userId,
          summary: input.summary,
          mood: input.mood,
          keyTakeaway: input.keyTakeaway,
          wordAffirmation: input.wordAffirmation,
          chat: input.chat,
          type: input.type,
          tasks: {
            create: input.actionableItems.map((item) => ({
              userId: ctx.session.userId,
              description: item,
            })),
          },
        },
        include: {
          tasks: true,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId;
    return ctx.db.journaling.findMany({
      where: {
        userId: userId,
      },
      include: {
        tasks: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.journaling.findUnique({
        where: {
          id: input.id,
        },
        include: {
          tasks: true,
        },
      });
    }),
});
