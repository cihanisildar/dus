'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ReactNode, useState } from 'react'

// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null

export function Providers({ children }: { children: ReactNode }) {
  // Create QueryClient instance (only once per component lifecycle)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  // If no Convex URL is configured, return children without Convex provider
  if (!convex) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    )
  }

  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ConvexProvider>
  )
}
