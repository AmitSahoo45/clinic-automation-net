import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ApiError } from '@/lib/api/api-error'
import { SessionProvider } from '@/lib/auth/session-context'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (error instanceof ApiError && error.status < 500) {
          return false
        }

        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </SessionProvider>
    </QueryClientProvider>
  )
}
