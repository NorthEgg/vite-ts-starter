import { beforeEach, describe, expect, it, vi } from 'vitest'

const authApiMocks = vi.hoisted(() => {
  return {
    changeLanguagePreference: vi.fn(),
    getCurrentUser: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn()
  }
})

vi.mock('@/modules/Auth/api', () => authApiMocks)

import { createErrorResponse, createSuccessResponse } from '@/api/core/helpers'
import {
  getCurrentSession,
  loginSession,
  logoutSession,
  updateLanguagePreference
} from '@/modules/Auth/services'

describe('auth services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps login and current-session dto responses into session models', async () => {
    const sessionDto = {
      locale: 'zh-hans',
      token: 'starter-token',
      user: {
        id: 'starter-user',
        name: 'Starter User',
        email: 'starter@example.com'
      }
    }

    authApiMocks.signIn.mockResolvedValue(createSuccessResponse(sessionDto))
    authApiMocks.getCurrentUser.mockResolvedValue(
      createSuccessResponse(sessionDto)
    )

    const loginResponse = await loginSession({
      email: 'starter@example.com',
      password: 'secret'
    })
    const currentSessionResponse = await getCurrentSession()

    expect(authApiMocks.signIn).toHaveBeenCalledWith({
      email: 'starter@example.com',
      password: 'secret'
    })
    expect(loginResponse).toMatchObject({
      success: true,
      data: {
        locale: 'zh-hans',
        token: 'starter-token',
        user: {
          id: 'starter-user',
          name: 'Starter User',
          email: 'starter@example.com'
        }
      }
    })
    expect(currentSessionResponse.data).toEqual(loginResponse.data)
  })

  it('maps locale updates and passes logout through unchanged', async () => {
    authApiMocks.changeLanguagePreference.mockResolvedValue(
      createSuccessResponse({
        locale: 'en'
      })
    )
    authApiMocks.signOut.mockResolvedValue(createSuccessResponse(null))

    const localeResponse = await updateLanguagePreference('en')
    const logoutResponse = await logoutSession()

    expect(authApiMocks.changeLanguagePreference).toHaveBeenCalledWith({
      locale: 'en'
    })
    expect(localeResponse.data).toEqual({
      locale: 'en'
    })
    expect(logoutResponse).toEqual(createSuccessResponse(null))
  })

  it('preserves api error responses for failed login calls', async () => {
    authApiMocks.signIn.mockResolvedValue(
      createErrorResponse(
        {
          code: 'invalid_credentials',
          message: 'Invalid credentials'
        },
        null
      )
    )

    const response = await loginSession({
      email: 'starter@example.com',
      password: 'wrong'
    })

    expect(response.success).toBe(false)
    expect(response.error).toMatchObject({
      code: 'invalid_credentials',
      message: 'Invalid credentials'
    })
  })
})
