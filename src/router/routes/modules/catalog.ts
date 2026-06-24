const catalogPage = () => import('@/modules/Catalog/pages/index.vue');

export const catalogRoutes: RouteRecordRaw[] = [
  {
    path: 'catalog',
    name: 'Catalog',
    meta: {
      title: '资源列表',
      requiresAuth: true,
      permission: 'catalog:list',
    },
    redirect: {
      name: 'CatalogList',
    },
    children: [
      {
        path: '',
        name: 'CatalogList',
        component: catalogPage,
        meta: {
          title: '资源列表',
          requiresAuth: true,
          permission: 'catalog:list',
        },
      },
      {
        path: 'list',
        name: 'CatalogListAlias',
        component: catalogPage,
        meta: {
          title: '资源目录',
          requiresAuth: true,
          permission: 'catalog:list',
        },
      },
    ],
  },
];
