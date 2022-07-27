import { useState } from 'react'
import type { AppRouter } from "../../server/src";
import { QueryClient, QueryClientProvider } from 'react-query';
import { createReactQueryHooks } from "@trpc/react";
import { MantineProvider, Container } from '@mantine/core';
import Posts from './components/posts'

const BACKEND_URL = "http://localhost:4000/trpc"

export const trpc = createReactQueryHooks<AppRouter>();

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({ url: BACKEND_URL }))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles>
          <Container><Posts /></Container>
        </MantineProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App
