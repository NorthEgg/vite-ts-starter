export interface AuthUserModel {
  id: string
  name: string
  email: string
}

export interface SessionModel {
  locale: string
  token: string
  user: AuthUserModel
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LocalePreferenceModel {
  locale: string
}
