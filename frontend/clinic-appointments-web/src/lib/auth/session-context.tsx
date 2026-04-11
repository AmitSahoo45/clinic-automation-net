/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api/api-client'
import { ApiError } from '@/lib/api/api-error'
import {
  type AuthResponsePayload,
  type SessionUser,
  parseSessionUser,
} from '@/lib/auth/auth-types'
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  setStoredAccessToken,
} from '@/lib/auth/auth-storage'

type SessionStatus = 'checking' | 'authenticated' | 'anonymous'

type SessionContextValue = {
  accessToken: string | null
  user: SessionUser | null
  status: SessionStatus
  isRestoring: boolean
  establishSession: (payload: AuthResponsePayload) => void
  updateSessionUser: (user: SessionUser) => void
  refreshSession: () => Promise<SessionUser | null>
  signOut: () => void
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(() => getStoredAccessToken())
  const [seedUser, setSeedUser] = useState<SessionUser | null>(null)
  const expiredTokenRef = useRef<string | null>(null)

  const sessionQuery = useQuery({
    queryKey: ['auth', 'me', accessToken],
    queryFn: async () => {
      const payload = await apiClient<unknown>('/auth/me', {
        accessToken,
      })

      return parseSessionUser(payload)
    },
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
  const isUnauthorized =
    Boolean(accessToken) &&
    sessionQuery.error instanceof ApiError &&
    (sessionQuery.error.status === 401 || sessionQuery.error.status === 403)

  useEffect(() => {
    if (!accessToken || !isUnauthorized || expiredTokenRef.current === accessToken) {
      return
    }

    expiredTokenRef.current = accessToken
    clearStoredAccessToken()
    toast.error('Your session expired. Sign in again when you are ready.')
  }, [accessToken, isUnauthorized])

  const user = seedUser ?? sessionQuery.data ?? null

  let status: SessionStatus = 'anonymous'
  if (accessToken && !isUnauthorized && !user && sessionQuery.isPending) {
    status = 'checking'
  } else if (user && !isUnauthorized) {
    status = 'authenticated'
  }

  async function refreshSession() {
    if (!accessToken) {
      return null
    }

    const result = await sessionQuery.refetch()
    return result.data ?? null
  }

  function establishSession(payload: AuthResponsePayload) {
    expiredTokenRef.current = null
    setStoredAccessToken(payload.accessToken)
    setAccessToken(payload.accessToken)
    setSeedUser({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    })
  }

  function updateSessionUser(userToStore: SessionUser) {
    setSeedUser(userToStore)
  }

  function signOut() {
    expiredTokenRef.current = null
    clearStoredAccessToken()
    setAccessToken(null)
    setSeedUser(null)
    toast.success('Signed out successfully.')
  }

  return (
    <SessionContext.Provider
      value={{
        accessToken,
        user,
        status,
        isRestoring: status === 'checking',
        establishSession,
        updateSessionUser,
        refreshSession,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider.')
  }

  return context
}
