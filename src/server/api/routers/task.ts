import { get } from "http";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getCompletedTask: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId;
    return ctx.db.task.findMany({
      where: {
        userId: userId,
        accepted: true,
        dateCompleted: {
          not: null,
        },
      },
      orderBy: {
        dateAssigned: "desc",
      },
    });
  }),
  getUncompletedTask: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId;
    return ctx.db.task.findMany({
      where: {
        userId: userId,
        accepted: true,
        dateCompleted: {
          equals: null,
        },
      },
      orderBy: {
        dateAssigned: "desc",
      },
    });
  }),
});
