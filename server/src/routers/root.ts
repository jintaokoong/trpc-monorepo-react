import { createRouter } from "../utils/trpc";

const root = createRouter()
  .query('', {
    resolve() {
      return {
        message: 'service is up!',
      };
    }
  });

export default root;