import type {
  AuthUserModel,
  LocalePreferenceModel,
  SessionModel,
} from '@/modules/Auth/models/session';

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
}

export interface SessionDTO {
  locale: string;
  token: string;
  user: AuthUserDTO;
}

export interface LocalePreferenceDTO {
  locale: string;
}

export function toAuthUserModel(dto: AuthUserDTO): AuthUserModel {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
  };
}

export function toSessionModel(dto: SessionDTO): SessionModel {
  return {
    locale: dto.locale,
    token: dto.token,
    user: toAuthUserModel(dto.user),
  };
}

export function toLocalePreferenceModel(
  dto: LocalePreferenceDTO,
): LocalePreferenceModel {
  return {
    locale: dto.locale,
  };
}
