import { createSuccessResponse } from '@/api/core/helpers'
import type { ApiResponse, AuthUser } from '@/api/core/types'

interface SessionPayload {
  locale: string
  token: string
  user: AuthUser
}

type LocalePreferencePayload = {
  locale: string
}

const starterUser: AuthUser = {
  id: 'starter-user',
  name: 'Starter User',
  email: 'starter@example.com'
}

export async function signIn(payload: {
  email: string
  password: string
}): Promise<ApiResponse<SessionPayload>> {
  return createSuccessResponse({
    user: {
      ...starterUser,
      email: payload.email || starterUser.email
    },
    token: 'starter-token',
    locale: 'en'
  })
}

export async function signOut(): Promise<ApiResponse<null>> {
  return createSuccessResponse(null)
}

export async function getCurrentUser(): Promise<ApiResponse<SessionPayload>> {
  return createSuccessResponse({
    user: starterUser,
    token: 'starter-token',
    locale: 'en'
  })
}

export async function changeLanguagePreference(
  payload: LocalePreferencePayload
): Promise<ApiResponse<LocalePreferencePayload>> {
  return createSuccessResponse({
    locale: payload.locale
  })
}
