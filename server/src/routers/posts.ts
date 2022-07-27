import { z } from 'zod';
import { createRouter } from "../utils/trpc";

const posts = createRouter()
  .query("posts", {
    resolve({ ctx }) {
      return ctx.prisma.post.findMany();
    }
  })
  .query("getPost", {
    input: z.string(),
    resolve({ input, ctx }) {
      return ctx.prisma.post.findFirst({ where: { id: input } });
    }
  })
  .mutation('createPost', {
    input: z.object({ content: z.string().min(1) }),
    resolve({ input, ctx }) {
      return ctx.prisma.post.create({
        data: {
          content: input.content,
        }
      });
    }
  })
  .mutation('deletePost', {
    input: z.string(),
    resolve({ input, ctx }) {
      return ctx.prisma.post.delete({ where: { id: input } });
    }
  })
  .mutation('updatePost', {
    input: z.object({ id: z.string(), content: z.string().min(1) }),
    resolve({ input, ctx }) {
      return ctx.prisma.post.update({
        where: { id: input.id },
        data: {
          content: input.content,
        },
      });
    }
  });

export default posts;