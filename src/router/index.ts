import { setupRouterGuards } from './guards/auth.guard';
import { staticRoutes } from './routes/static';

const history =
  process.env.VITE_ROUTER_MODE === 'hash'
    ? createWebHashHistory()
    : createWebHistory();

const router = createRouter({
  history,
  routes: staticRoutes,
});

export function setupRouter(app: App) {
  setupRouterGuards(router);
  app.use(router);
}
