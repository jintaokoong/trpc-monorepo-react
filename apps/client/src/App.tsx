import { useState } from 'react'
import type { AppRouter } from "../../server/src";
import { QueryClient, QueryClientProvider } from 'react-query';
import { createReactQueryHooks } from "@trpc/react";
import Greeter from './components/greeter'

const BACKEND_URL = "http://localhost:4000/trpc"

export const trpc = createReactQueryHooks<AppRouter>();

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({ url: BACKEND_URL }))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Greeter />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App
