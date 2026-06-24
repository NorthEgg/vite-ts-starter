import LocaleInject from '@/widgets/LocaleInject';
import ModalDialog from '@/widgets/ModalDialog';

export default {
  install(app: import('vue').App<any>) {
    app.use(ModalDialog);
    app.use(LocaleInject);
  },
};
