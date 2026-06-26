import path from 'path';

import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import UnpluginIcons from 'unplugin-icons/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import type { Plugin } from 'vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

const vendorChunkGroups: Record<string, string[]> = {
  'vendor-core': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
  'vendor-ui': ['element-plus', '@element-plus/icons-vue'],
  'vendor-utils': ['axios', 'lodash-es', 'nprogress'],
  'vendor-visualization': ['echarts'],
};

function getPackageName(id: string) {
  const normalized = id.replace(/\\/g, '/');
  const match = normalized.match(
    /(?:\.pnpm\/[^/]+\/node_modules\/|node_modules\/)((?:@[^/]+\/)?[^/]+)/,
  );
  return match?.[1];
}

function matchesPackage(packageName: string | undefined, target: string) {
  if (!packageName) return false;
  return packageName === target || packageName.startsWith(`${target}/`);
}

function getManualChunk(id: string) {
  if (!id.includes('node_modules')) return undefined;

  const packageName = getPackageName(id);

  for (const [chunkName, packages] of Object.entries(vendorChunkGroups)) {
    if (packages.some((pkg) => matchesPackage(packageName, pkg))) {
      return chunkName;
    }
  }

  return 'vendor-misc';
}

function getAssetFileName(assetInfo: { name?: string }) {
  const assetName = assetInfo.name ?? '';
  const ext = path.extname(assetName).slice(1);

  if (['css', 'scss'].includes(ext)) {
    return 'css/[name]-[hash][extname]';
  }

  if (
    ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif', 'ico'].includes(ext)
  ) {
    return 'img/[name]-[hash][extname]';
  }

  if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext)) {
    return 'fonts/[name]-[hash][extname]';
  }

  return 'assets/[name]-[hash][extname]';
}

const htmlPlugin = (): Plugin => {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      return html.replace(
        /<title>(.*?)<\/title>/,
        '<title>Vite TS Starter</title>',
      );
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_ROUTER_MODE === 'hash' ? '' : '/',
    plugins: [
      UnoCSS(),
      vue(),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue\??/],
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            vue: ['createVNode', 'render'],
            'vue-router': [
              'createRouter',
              'createWebHistory',
              'createWebHashHistory',
              'useRouter',
              'useRoute',
            ],
            uuid: [['v4', 'uuidv4']],
            // 全局使用 _.xxxx()
            'lodash-es': [
              // default imports
              ['*', '_'], // import { * as _ } from 'lodash-es',
            ],
          },
          // type import
          {
            from: 'vue',
            imports: [
              'App',
              'VNode',
              'ComponentPublicInstance',
              'ComponentPublicInstanceCostom',
              'ComponentInternalInstance',
            ],
            type: true,
          },
          {
            from: 'vue-router',
            imports: [
              'RouteRecordRaw',
              'RouteLocationRaw',
              'LocationQuery',
              'RouteParams',
              'RouteLocationNormalizedLoaded',
              'RouteRecordName',
              'NavigationGuard',
            ],
            type: true,
          },
        ],
        resolvers: mode === 'development' ? [] : [ElementPlusResolver()],
        dirs: ['./src/composables'],
        dts: './auto-imports.d.ts',
        vueTemplate: true,
      }),
      Components({
        directoryAsNamespace: true,
        collapseSamePrefixes: true,
        resolvers: [
          IconsResolver({
            prefix: 'AutoIcon',
          }),
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
      }),
      // Auto use Iconify icon
      UnpluginIcons({
        autoInstall: true,
        compiler: 'vue3',
        scale: 1.2,
        defaultStyle: '',
        defaultClass: 'unplugin-icon',
      }),
      htmlPlugin(),
    ],
    // According to the need to open proxy
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: 'http://172.xx.xxx.xx/xxxxxxx/api',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
    // },
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
    define: {
      'process.env.VITE_ROUTER_MODE': JSON.stringify(env.VITE_ROUTER_MODE),
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      cssCodeSplit: true,
      assetsInlineLimit: 4 * 1024,
      rollupOptions: {
        output: {
          manualChunks: getManualChunk,
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: getAssetFileName,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `@use '@/styles/element-variables.scss' as *;`,
        },
      },
    },
    test: {
      globals: true,
      dir: '__tests__',
      environment: 'jsdom',
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
  };
});
