import * as trpc from '@trpc/server';

// define context
export const createContext = (_?: any): { user?: string } => {
  return {
  }
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => {
  return trpc.router<Context>();
}
