import { describe, expect, it } from 'vitest';

import { authRoutes } from '@/router/routes/modules/auth';
import { catalogRoutes } from '@/router/routes/modules/catalog';
import { detailRoutes } from '@/router/routes/modules/detail';
import { staticRoutes } from '@/router/routes/static';

describe('router route meta conventions', () => {
  it('keeps auth routes public with explicit titles', () => {
    expect(authRoutes[0]?.meta).toMatchObject({
      title: '认证',
      requiresAuth: false,
    });
    expect(authRoutes[0]?.children?.[0]?.meta).toMatchObject({
      title: '登录',
      requiresAuth: false,
    });
  });

  it('keeps catalog routes behind auth with explicit permission metadata', () => {
    expect(catalogRoutes[0]?.meta).toMatchObject({
      requiresAuth: true,
      permission: 'catalog:list',
    });
    expect(catalogRoutes[0]?.children?.[0]?.meta).toMatchObject({
      title: '资源列表',
      requiresAuth: true,
      permission: 'catalog:list',
    });
    expect(catalogRoutes[0]?.children?.[1]?.meta).toMatchObject({
      title: '资源目录',
      requiresAuth: true,
      permission: 'catalog:list',
    });
  });

  it('keeps detail routes behind auth with explicit permission metadata', () => {
    expect(detailRoutes[0]?.meta).toMatchObject({
      requiresAuth: true,
    });
    expect(detailRoutes[1]?.meta).toMatchObject({
      title: '详情页',
      requiresAuth: true,
      permission: 'catalog:detail',
    });
    expect(detailRoutes[1]?.children?.[0]?.meta).toMatchObject({
      title: '详情页',
      requiresAuth: true,
      permission: 'catalog:detail',
    });
  });

  it('keeps static shell routes and 404 public', () => {
    const rootRoute = staticRoutes.find((route) => route.name === 'Root');
    const localizedShell = staticRoutes.find((route) =>
      route.path.includes(':locale'),
    );
    const langRootRoute = localizedShell?.children?.find(
      (route) => route.name === 'LangRoot',
    );
    const notFoundRoute = staticRoutes.find((route) => route.name === '404');

    expect(rootRoute?.meta?.requiresAuth).toBe(false);
    expect(localizedShell?.meta?.requiresAuth).toBe(false);
    expect(langRootRoute?.meta?.requiresAuth).toBe(false);
    expect(notFoundRoute?.meta?.requiresAuth).toBe(false);
  });
});
