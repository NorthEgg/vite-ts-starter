<script lang="ts">
import { ElMessage, useLocale } from 'element-plus'
import { Promotion } from '@element-plus/icons-vue'

import AuthContainerLayout from '@/modules/Auth/components/AuthContainerLayout.vue'

import Translations from '@/locales/Translations.vue'
import { useSessionStore } from '@/hooks/useBaseStore'

import Cookie from 'js-cookie'

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

    const isLoading = ref(true)
    const inputErrorEmail = ref('')
    const inputErrorPassword = ref('')
    const formData = reactive({
      email: '',
      password: ''
    })

    const localeInject = useLocale()

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
                  message: `😄 ${ localeInject.t('auth.forgotPassword') }`
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

    function setLoading(loading = false) {
      isLoading.value = loading
    }

    function onSubmit(refForm: any) {
      if (isLoading.value) return

      refForm.validate(async (valid: boolean) => {
        if (!valid) return
        inputErrorEmail.value = ''
        inputErrorPassword.value = ''

        setLoading(true)
        const { error, data, message } = await sessionStore.login(formData)
        if (error) {
          inputErrorEmail.value = ' '
          inputErrorPassword.value = message
          setLoading(false)
          return
        }
        Cookie.set('token', data.token)
        router
          .replace(`/${ route.params.locale || '' }`)
          .then(() => {
            ElMessage.success({
              message: localeInject.t('auth.loginSuccess')
            })
          })
          .catch(() => {})
      })
    }

    setLoading(true)
    onMounted(() => {
      nextTick(() => {
        setLoading(false)
      })
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
