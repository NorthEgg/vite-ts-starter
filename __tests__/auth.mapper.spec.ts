import { describe, expect, it } from 'vitest';

import {
  toAuthUserModel,
  toLocalePreferenceModel,
  toSessionModel,
} from '@/modules/Auth/mappers/session';

describe('auth session mapper', () => {
  it('maps auth user dto to model', () => {
    expect(
      toAuthUserModel({
        id: 'starter-user',
        name: 'Starter User',
        email: 'starter@example.com',
      }),
    ).toEqual({
      id: 'starter-user',
      name: 'Starter User',
      email: 'starter@example.com',
    });
  });

  it('maps session and locale preference dto to model', () => {
    expect(
      toSessionModel({
        locale: 'zh-hans',
        token: 'starter-token',
        user: {
          id: 'starter-user',
          name: 'Starter User',
          email: 'starter@example.com',
        },
      }),
    ).toEqual({
      locale: 'zh-hans',
      token: 'starter-token',
      user: {
        id: 'starter-user',
        name: 'Starter User',
        email: 'starter@example.com',
      },
    });

    expect(
      toLocalePreferenceModel({
        locale: 'en',
      }),
    ).toEqual({
      locale: 'en',
    });
  });
});
