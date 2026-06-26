import 'virtual:uno.css';
import { i18n } from '@/locales';
import Mixin from '@/mixins';
import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import '@/assets/fonts';
import Widgets from '@/widgets';

import App from './App.vue';

const app = createApp(App);

function setupPlugins() {
  app.use(i18n).use(Widgets).mixin(Mixin);
}

async function setupApp() {
  setupRouter(app);
  setupStore(app);
  app.mount('#app');
}

setupPlugins();
setupApp();

export default app;
