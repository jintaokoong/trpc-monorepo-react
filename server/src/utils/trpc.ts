import { PrismaClient } from '@prisma/client';
import * as trpc from '@trpc/server';

export const prisma = new PrismaClient();

// define context
export const createContext = (_?: any) => {
  return {
    prisma,
  }
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => {
  return trpc.router<Context>();
}
