<script lang="ts">
import { Promotion } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';

import { useSessionStore } from '@/composables/useBaseStore';
import Translations from '@/locales/Translations.vue';
import AuthContainerLayout from '@/modules/Auth/components/AuthContainerLayout.vue';
import { useAuthLogin } from '@/modules/Auth/composables/useAuthLogin';

export default defineComponent({
  name: 'AuthLoginPage',
  components: {
    AuthContainerLayout,
    Promotion,
    Translations,
  },
  setup() {
    const { proxy } = useCurrentInstance();
    const sessionStore = useSessionStore();
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const {
      formData,
      inputErrorEmail,
      inputErrorPassword,
      isLoading,
      onSubmit,
      setLoading,
    } = useAuthLogin({
      sessionStore,
      route,
      router,
    });

    const configAuth = computed(() => {
      return {
        title: t('auth.welcome'),
        actionList: [
          {
            attrs: {
              type: 'primary',
              loading: isLoading.value,
              size: 'large',
            },
            text: t('auth.signin'),
            on: {
              click(refForm: any) {
                onSubmit(refForm);
              },
            },
          },
        ],
        formConfig: [
          {
            attrs: {
              prop: 'email',
              error: inputErrorEmail.value,
              rules() {
                return [
                  proxy.getRequiredRules({
                    trigger: 'change',
                    message: t('auth.emailRequired'),
                  }),
                  proxy.getValidatorRules('', 'blur', {
                    type: 'email',
                    message: t('auth.emailInvalid'),
                  }),
                ];
              },
            },
            label: t('auth.email'),
            prefixIcon: h('span', {
              class: 'text-16px i-ic:baseline-mail-lock',
            }),
            placeholder: t('auth.emailRequired'),
          },
          {
            attrs: {
              prop: 'password',
              error: inputErrorPassword.value,
              rules() {
                return proxy.getRequiredRules({
                  trigger: 'change',
                  message: t('auth.passwordRequired'),
                });
              },
            },
            link: {
              text: t('auth.forgotPassword'),
              click() {
                ElMessage.info({
                  message: `😄 ${t('auth.forgotPassword')}`,
                });
              },
            },
            type: 'password',
            label: t('auth.password'),
            prefixIcon: h('span', {
              class: 'text-16px i-ri:lock-password-fill',
            }),
            placeholder: t('auth.passwordRequired'),
          },
        ],
      };
    });

    return {
      isLoading,
      inputErrorEmail,
      inputErrorPassword,
      formData,
      configAuth,

      setLoading,
      onSubmit,
    };
  },
});
</script>

<template>
  <div
    class="auth-login"
    :class="[
      'bgimage-images-logo-background-jpg',
      'bg-cover bg-no-repeat bg-center',
    ]"
  >
    <div class="auth-login__nav">
      <div class="nav-left">
        <div
          class="nav-logo"
          :class="[
            'bgimage-images-logo-svg',
            'bg-contain bg-no-repeat bg-center',
          ]"
        ></div>
        <div class="nav-circle"></div>
        <div class="nav-title">
          {{ $t('base.systemTitle') }}
        </div>
      </div>
      <div class="nav-right">
        <Translations dark />
      </div>
    </div>
    <div class="auth-login__body">
      <AuthContainerLayout
        v-bind="configAuth"
        :form-data="formData"
        @on-submit="onSubmit"
      >
        <template #titleIcon>
          <!-- <img
          src="@/assets/images/logo.svg"
          alt=""
        > -->
          <el-icon>
            <Promotion />
          </el-icon>
        </template>
      </AuthContainerLayout>
    </div>
    <FooterCustom />
  </div>
</template>

<style lang="scss" scoped>
.auth-login {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .auth-login__nav {
    display: flex;
    justify-content: space-between;
    color: #484848;
    padding: 0 16px;
    box-shadow: 0 -3px 8px 3px #c6c6c6;

    // box-shadow: 0 1px 4px 3px rgb(0 21 41 / 8%);

    background-color: rgba(#fff, 10%);

    .nav-left,
    .nav-right {
      display: flex;
      height: 48px;
      align-items: center;
    }

    .nav-logo {
      width: 40px;
      height: 30px;
    }

    .nav-circle {
      width: 6px;
      height: 6px;
      margin: 0 7px;
      border-radius: 50%;
      background: #484848;
    }

    .nav-title {
      font-size: 18px;
      font-weight: 500;
      line-height: 25px;
    }
  }

  .auth-login__body {
    --at-apply: flex-1 flex items-center justify-end;
  }
}
</style>
