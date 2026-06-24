const detailPage = () => import('@/modules/Detail/pages/index.vue');
const layoutView = () => import('@/components/Layout/LayoutView.vue');

export const detailRoutes: RouteRecordRaw[] = [
  {
    path: 'detail',
    redirect: {
      name: 'CatalogList',
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'detail/:resourceId',
    component: layoutView,
    name: 'Detail',
    meta: {
      title: '详情页',
      requiresAuth: true,
      permission: 'catalog:detail',
    },
    redirect: {
      name: 'DetailOverview',
    },
    children: [
      {
        path: 'overview',
        name: 'DetailOverview',
        component: detailPage,
        meta: {
          title: '详情页',
          requiresAuth: true,
          permission: 'catalog:detail',
        },
      },
    ],
  },
];
