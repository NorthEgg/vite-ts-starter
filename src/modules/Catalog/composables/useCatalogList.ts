import { useI18n } from 'vue-i18n';

import type { CreateResourcePayload } from '@/modules/Catalog/models/resource';
import type useCatalogStore from '@/modules/Catalog/store';

type CatalogStore = ReturnType<typeof useCatalogStore>;

interface CatalogDialogInstance {
  validateRules: () => Promise<boolean>;
}

interface CatalogDialogContext {
  fullLoading: boolean;
}

interface UseCatalogListOptions {
  catalogStore: CatalogStore;
  openDialog: (options: {
    title: string;
    top: string;
    width: string;
    showClose: boolean;
    closeOnClickModal: boolean;
    closeOnPressEscape: boolean;
    renderComponent: {
      data: CreateResourcePayload;
      component: unknown;
    };
    onConfirm: (
      instance: CatalogDialogInstance,
      context: CatalogDialogContext,
    ) => Promise<void>;
  }) => void;
  resourceFormComponent: unknown;
}

export function useCatalogList(options: UseCatalogListOptions) {
  const { catalogStore, openDialog, resourceFormComponent } = options;
  const { t } = useI18n();

  const loadingContent = ref(true);
  const testI18nDate = ref();

  async function load(keyword?: string) {
    loadingContent.value = true;

    try {
      await catalogStore.loadItems(keyword);
    } finally {
      loadingContent.value = false;
    }
  }

  function handleCreateResource() {
    const formData = reactive<CreateResourcePayload>({
      title: '',
      subtitle: '',
      description: '',
    });

    openDialog({
      title: t('catalog.create'),
      top: '10vh',
      width: '50vw',
      showClose: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      renderComponent: {
        data: formData,
        component: resourceFormComponent,
      },
      async onConfirm(instance, context) {
        const isValid = await instance.validateRules();

        if (!isValid) {
          return Promise.reject(new Error('error'));
        }

        context.fullLoading = true;
        const { error } = await catalogStore.createItem(formData);
        context.fullLoading = false;

        if (error) {
          return Promise.reject(new Error('error'));
        }

        await load();
      },
    });
  }

  onMounted(() => {
    void load();
  });

  return {
    handleCreateResource,
    handleSelectSearch: load,
    loadingContent,
    testI18nDate,
  };
}
