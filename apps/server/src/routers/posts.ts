import { z } from 'zod';
import { v4 } from 'uuid';
import { createRouter } from "../utils/trpc";

interface Post {
  id: string;
  content: string;
}

const memoryPosts: Post[] = [];

const posts = createRouter()
  .query("posts", {
    resolve() {
      return memoryPosts;
    }
  })
  .query("getPost", {
    input: z.string(),
    resolve({ input }) {
      return memoryPosts.find(post => post.id === input);
    }
  })
  .mutation('createPost', {
    input: z.object({ content: z.string().min(1) }),
    resolve({ input }) {
      const post = { ...input, id: v4() };
      memoryPosts.push(post);
      return post;
    }
  })
  .mutation('deletePost', {
    input: z.string(),
    resolve({ input }) {
      const index = memoryPosts.findIndex(post => post.id === input);
      if (index === -1) {
        throw new Error(`post ${input} not found`);
      }
      memoryPosts.splice(index, 1);
      return input;
    }
  })
  .mutation('updatePost', {
    input: z.object({ id: z.string(), content: z.string().min(1) }),
    resolve({ input }) {
      const index = memoryPosts.findIndex(post => post.id === input.id);
      if (index === -1) {
        throw new Error(`post ${input.id} not found`);
      }
      memoryPosts[index] = { ...memoryPosts[index], ...input };
      return input;
    }
  });

export default posts;