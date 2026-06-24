<script lang="ts">
import { ElMessage, useLocale } from 'element-plus'
import { Promotion } from '@element-plus/icons-vue'

import AuthContainerLayout from '@/modules/Auth/components/AuthContainerLayout.vue'
import { useAuthLogin } from '@/modules/Auth/composables/useAuthLogin'

import Translations from '@/locales/Translations.vue'
import { useSessionStore } from '@/composables/useBaseStore'

export default defineComponent({
  name: 'AuthLoginPage',
  components: {
    AuthContainerLayout,
    Promotion,
    Translations
  },
  setup() {
    const { proxy } = useCurrentInstance()
    const sessionStore = useSessionStore()
    const route = useRoute()
    const router = useRouter()
    const localeInject = useLocale()
    const {
      formData,
      inputErrorEmail,
      inputErrorPassword,
      isLoading,
      onSubmit,
      setLoading
    } = useAuthLogin({
      sessionStore,
      localeInject,
      route,
      router
    })

    const configAuth = computed(() => {
      return {
        title: localeInject.t('auth.welcome'),
        actionList: [
          {
            attrs: {
              type: 'primary',
              loading: isLoading.value,
              size: 'large'
            },
            text: localeInject.t('auth.signin'),
            on: {
              click(refForm: any) {
                onSubmit(refForm)
              }
            }
          }
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
                    message: localeInject.t('auth.emailRequired')
                  }),
                  proxy.getValidatorRules('', 'blur', {
                    type: 'email',
                    message: localeInject.t('auth.emailInvalid')
                  })
                ]
              }
            },
            label: localeInject.t('auth.email'),
            prefixIcon: h('span', {
              class: 'text-16px i-ic:baseline-mail-lock'
            }),
            placeholder: localeInject.t('auth.emailRequired')
          },
          {
            attrs: {
              prop: 'password',
              error: inputErrorPassword.value,
              rules() {
                return proxy.getRequiredRules({
                  trigger: 'change',
                  message: localeInject.t('auth.passwordRequired')
                })
              }
            },
            link: {
              text: localeInject.t('auth.forgotPassword'),
              click() {
                ElMessage.info({
                  message: `😄 ${localeInject.t('auth.forgotPassword')}`
                })
              }
            },
            type: 'password',
            label: localeInject.t('auth.password'),
            prefixIcon: h('span', {
              class: 'text-16px i-ri:lock-password-fill'
            }),
            placeholder: localeInject.t('auth.passwordRequired')
          }
        ]
      }
    })

    return {
      isLoading,
      inputErrorEmail,
      inputErrorPassword,
      formData,
      configAuth,

      setLoading,
      onSubmit
    }
  }
})
</script>

<template>
  <div
    class="auth-login"
    :class="[
      'bgimage-images-logo-background-jpg',
      'bg-cover bg-no-repeat bg-center'
    ]"
  >
    <div class="auth-login__nav">
      <div class="nav-left">
        <div
          class="nav-logo"
          :class="[
            'bgimage-images-logo-svg',
            'bg-contain bg-no-repeat bg-center'
          ]"
        ></div>
        <div class="nav-circle"></div>
        <div class="nav-title">
          {{ _t('base.systemTitle') }}
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
