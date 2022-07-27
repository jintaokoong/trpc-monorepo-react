import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import posts from './routers/posts';
import { createRouter, createContext } from './utils/trpc';

export const appRouter = createRouter()
  .query('hello', {
    resolve() {
      return {
        greeting: 'hello',
      }
    }
  })  
.merge(posts);

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
    createContext,
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
