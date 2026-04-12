import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserInfo } from '@/types'

interface AuthState {
  user: UserInfo | null
  accessToken: string | null
  refreshToken: string | null
  isLoggedIn: boolean
  _hasHydrated: boolean
  setAuth:        (user: UserInfo, access: string, refresh: string) => void
  setTokens:      (access: string, refresh: string) => void
  logout:         () => void
  setHasHydrated: (v: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, accessToken: null, refreshToken: null, isLoggedIn: false, _hasHydrated: false,
      setAuth:        (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken, isLoggedIn: true }),
      setTokens:      (accessToken, refreshToken)        => set({ accessToken, refreshToken }),
      logout:         ()                                 => set({ user: null, accessToken: null, refreshToken: null, isLoggedIn: false }),
      setHasHydrated: (v)                                => set({ _hasHydrated: v }),
    }),
    {
      name: 'propfind-auth',
      onRehydrateStorage: () => (state) => { state?.setHasHydrated(true) },
    }
  )
)
