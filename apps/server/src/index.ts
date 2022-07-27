import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import * as trpc from '@trpc/server'

// define context
const createContext = (_?: any): { user?: string } => {
  return {
  }
}
type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const appRouter = trpc.router<Context>()
  .query('hello', {
    resolve() {
      return {
        greeting: "hello world",
      }
    }
  });

export type AppRouter = typeof appRouter;

const server = fastify({
  maxParamLength: 5000,
})
server.register(cors, {
  origin: '*',
});
server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext
  },
})

const PORT = 4000;

(async () => {
  try {
    const address = await server.listen({
      port: PORT,
    })
    console.log(`server listening on ${address}`)
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
