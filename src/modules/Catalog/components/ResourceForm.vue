<script lang="ts">
export default defineComponent({
  name: 'ResourceForm',
  props: {
    modelValue: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup() {
    const refForm = ref()

    const validateRules = async () => {
      return new Promise((resolve) => {
        refForm.value.validate((valid: boolean) => {
          if (valid) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    }

    return {
      refForm,
      validateRules
    }
  }
})
</script>

<template>
  <div class="resource-form-container">
    <el-form
      ref="refForm"
      :model="modelValue"
      label-position="right"
      label-width="145px"
    >
      <el-form-item
        prop="name"
        :label="_t('catalog.name')"
        :rules="
          getRequiredRules({
            trigger: 'change',
            message: _t('base.pleaseInput')
          })
        "
      >
        <el-input
          v-model="modelValue.title"
          maxlength="30"
          show-word-limit
          :placeholder="_t('catalog.name')"
        />
      </el-form-item>
      <el-form-item
        prop="subtitle"
        :label="_t('catalog.subtitle')"
        :rules="
          getRequiredRules({
            trigger: 'change',
            message: _t('base.pleaseInput')
          })
        "
      >
        <el-input
          v-model="modelValue.subtitle"
          maxlength="30"
          show-word-limit
          :placeholder="_t('catalog.subtitle')"
        />
      </el-form-item>
      <el-form-item prop="description" :label="_t('catalog.description')">
        <el-input
          v-model="modelValue.description"
          type="textarea"
          :placeholder="_t('catalog.description')"
          maxlength="200"
          :autosize="{ minRows: 2 }"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.resource-form-container {

  .footer-button-list {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
