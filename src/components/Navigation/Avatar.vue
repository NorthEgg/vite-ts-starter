<script lang="ts">
import { SwitchButton } from '@element-plus/icons-vue';
import Cookie from 'js-cookie';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'NavigationAvatar',
  components: {
    SwitchButton,
  },
  setup() {
    const { t } = useI18n();

    const commandList = computed(() => [
      {
        label: t('auth.signout'),
        icon: 'switch-button',
        click: () => {
          Cookie.remove('token');
          window.location.reload();
        },
      },
    ]);

    const handleCommand = (cmdItem: { click?: () => void }) => {
      cmdItem.click?.();
    };
    return {
      commandList,

      handleCommand,
    };
  },
});
</script>

<template>
  <el-dropdown class="navigation-avatar" trigger="hover">
    <div style="outline: none; padding: 0 12px">
      <img src="@/assets/images/navigation-avatar.webp" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(cmdItem, index) in commandList"
          :key="index"
          @click="handleCommand(cmdItem)"
        >
          <div class="navigation-avatar__dropdown-command">
            <el-icon>
              <component :is="cmdItem.icon" />
            </el-icon>
            <span>{{ cmdItem.label }}</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss">
.navigation-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  outline: none;

  img {
    outline: none;
    width: 24px;
    border: 1px solid $color-primary;
    border-radius: 50%;
  }
}

.navigation-avatar__dropdown-command {
  display: flex;
  align-items: center;
  user-select: none;
  white-space: nowrap;
}
</style>
