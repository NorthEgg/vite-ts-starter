import { ElMessage } from 'element-plus';

import type { LoginPayload } from '@/modules/Auth/models/session';
import type useSessionStore from '@/modules/Auth/store';

type SessionStore = ReturnType<typeof useSessionStore>;

interface UseAuthLoginOptions {
  sessionStore: SessionStore;
  localeInject: ReturnType<(typeof import('element-plus'))['useLocale']>;
  route: ReturnType<typeof useRoute>;
  router: ReturnType<typeof useRouter>;
}

export function useAuthLogin(options: UseAuthLoginOptions) {
  const { sessionStore, localeInject, route, router } = options;

  const isLoading = ref(true);
  const inputErrorEmail = ref('');
  const inputErrorPassword = ref('');
  const formData = reactive<LoginPayload>({
    email: '',
    password: '',
  });

  function setLoading(loading = false) {
    isLoading.value = loading;
  }

  function clearErrors() {
    inputErrorEmail.value = '';
    inputErrorPassword.value = '';
  }

  function setSubmitError(message: string) {
    inputErrorEmail.value = ' ';
    inputErrorPassword.value = message;
  }

  function onSubmit(refForm: {
    validate: (callback: (valid: boolean) => void) => void;
  }) {
    if (isLoading.value) return;

    refForm.validate(async (valid) => {
      if (!valid) return;

      clearErrors();
      setLoading(true);

      const { error, message } = await sessionStore.login(formData);

      if (error) {
        setSubmitError(message);
        setLoading(false);
        return;
      }

      await router
        .replace(`/${route.params.locale || ''}`)
        .then(() => {
          ElMessage.success({
            message: localeInject.t('auth.loginSuccess'),
          });
        })
        .catch(() => {});
    });
  }

  onMounted(() => {
    nextTick(() => {
      setLoading(false);
    });
  });

  return {
    isLoading,
    inputErrorEmail,
    inputErrorPassword,
    formData,
    onSubmit,
    setLoading,
  };
}
