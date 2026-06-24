import { mapApiResponse } from '@/api/core/helpers';
import type { ApiResponse } from '@/api/core/types';
import {
  changeLanguagePreference,
  getCurrentUser,
  signIn,
  signOut,
} from '@/modules/Auth/api';
import {
  toLocalePreferenceModel,
  toSessionModel,
} from '@/modules/Auth/mappers/session';
import type {
  LocalePreferenceModel,
  LoginPayload,
  SessionModel,
} from '@/modules/Auth/models/session';

export async function loginSession(
  payload: LoginPayload,
): Promise<ApiResponse<SessionModel>> {
  const response = await signIn(payload);
  return mapApiResponse(response, toSessionModel);
}

export async function logoutSession(): Promise<ApiResponse<null>> {
  return signOut();
}

export async function getCurrentSession(): Promise<ApiResponse<SessionModel>> {
  const response = await getCurrentUser();
  return mapApiResponse(response, toSessionModel);
}

export async function updateLanguagePreference(
  locale: string,
): Promise<ApiResponse<LocalePreferenceModel>> {
  const response = await changeLanguagePreference({
    locale,
  });
  return mapApiResponse(response, toLocalePreferenceModel);
}
