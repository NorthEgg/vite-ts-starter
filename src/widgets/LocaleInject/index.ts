import { useLocale } from 'element-plus';

import { useLanguage } from '@/composables/useLanguage';

export default {
  install(app: import('vue').App<any>) {
    app.config.globalProperties._t = function (str: string) {
      const { currentLocaleLang } = useLanguage();
      const { t } = useLocale(currentLocaleLang);
      return t(str);
    };
  },
};
