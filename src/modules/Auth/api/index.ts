import { createSuccessResponse } from '@/api/core/helpers';
import type { ApiResponse } from '@/api/core/types';
import type {
  LocalePreferenceDTO,
  SessionDTO,
} from '@/modules/Auth/mappers/session';
import type { LoginPayload } from '@/modules/Auth/models/session';

const starterUser = {
  id: 'starter-user',
  name: 'Starter User',
  email: 'starter@example.com',
};

export async function signIn(
  payload: LoginPayload,
): Promise<ApiResponse<SessionDTO>> {
  return createSuccessResponse({
    user: {
      ...starterUser,
      email: payload.email || starterUser.email,
    },
    token: 'starter-token',
    locale: 'en',
  });
}

export async function signOut(): Promise<ApiResponse<null>> {
  return createSuccessResponse(null);
}

export async function getCurrentUser(): Promise<ApiResponse<SessionDTO>> {
  return createSuccessResponse({
    user: starterUser,
    token: 'starter-token',
    locale: 'en',
  });
}

export async function changeLanguagePreference(
  payload: LocalePreferenceDTO,
): Promise<ApiResponse<LocalePreferenceDTO>> {
  return createSuccessResponse({
    locale: payload.locale,
  });
}
