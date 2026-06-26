<script lang="ts">
export default defineComponent({
  name: 'ResourceForm',
  props: {
    modelValue: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup() {
    const refForm = ref();

    const validateRules = async () => {
      return new Promise((resolve) => {
        refForm.value.validate((valid: boolean) => {
          if (valid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    };

    return {
      refForm,
      validateRules,
    };
  },
});
</script>

<template>
  <div class="resource-form-container">
    <ElForm
      ref="refForm"
      :model="modelValue"
      label-position="right"
      label-width="145px"
    >
      <ElFormItem
        prop="name"
        :label="$t('catalog.name')"
        :rules="
          getRequiredRules({
            trigger: 'change',
            message: $t('base.pleaseInput'),
          })
        "
      >
        <ElInput
          v-model="modelValue.title"
          maxlength="30"
          show-word-limit
          :placeholder="$t('catalog.name')"
        />
      </ElFormItem>
      <ElFormItem
        prop="subtitle"
        :label="$t('catalog.subtitle')"
        :rules="
          getRequiredRules({
            trigger: 'change',
            message: $t('base.pleaseInput'),
          })
        "
      >
        <ElInput
          v-model="modelValue.subtitle"
          maxlength="30"
          show-word-limit
          :placeholder="$t('catalog.subtitle')"
        />
      </ElFormItem>
      <ElFormItem prop="description" :label="$t('catalog.description')">
        <ElInput
          v-model="modelValue.description"
          type="textarea"
          :placeholder="$t('catalog.description')"
          maxlength="200"
          :autosize="{ minRows: 2 }"
          show-word-limit
        />
      </ElFormItem>
    </ElForm>
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
