const catalogPage = () => import('@/modules/Catalog/pages/index.vue');

export const catalogRoutes: RouteRecordRaw[] = [
  {
    path: 'catalog',
    name: 'Catalog',
    meta: {
      title: '资源列表',
      titleKey: 'page.catalogList',
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
          titleKey: 'page.catalogList',
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
          titleKey: 'page.catalogDirectory',
          requiresAuth: true,
          permission: 'catalog:list',
        },
      },
    ],
  },
];
