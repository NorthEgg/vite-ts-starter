# Vue Admin Starter

一个面向中后台项目的 Vue 3 初始化架构模板，基于 `Vite + TypeScript + Element Plus + Pinia + UnoCSS`，内置路由、多语言、请求封装、工程化校验和一套可继续裁剪的模块化目录结构。

这个仓库的目标不是“功能最全”，而是作为我自己的长期起步模板：

- 保留稳定、通用、值得复用的工程骨架
- 去掉强业务绑定和一次性的 demo 噪音
- 新项目可以在此基础上快速替换模块、文案、接口和视觉层

## 技术栈

- `Vue 3`
- `Vite 8`
- `TypeScript 6`
- `Element Plus`
- `Pinia`
- `Vue Router`
- `UnoCSS`
- `Axios`
- `Vitest`
- `Oxlint + Oxfmt + Stylelint`
- `Husky + lint-staged + commitlint`

## 模板特性

- 内置基础工程规范：`oxlint`、`oxfmt`、`stylelint`、提交信息校验
- 内置类型检查和单元测试能力
- 支持 `Element Plus` 组件自动导入
- 支持 `UnoCSS` 原子化样式
- 支持基于路由参数的多语言切换
- 内置基础权限守卫和 `NProgress`
- 内置请求层封装与统一响应处理入口
- 提供按 `modules` 组织的页面骨架和业务分层方式
- 提供可复用的全局弹窗服务 `$ModalDialog`
- 默认包含登录、列表、详情三类典型中后台页面骨架，方便新项目替换

## 目录约定

```text
src/
  assets/        静态资源
  components/    通用组件
  hooks/         组合式 hooks
  locales/       多语言配置
  modules/       业务模块
  router/        路由与守卫
  store/         Pinia 状态管理
  styles/        全局样式与变量
  types/         全局类型补充
  utils/         工具函数与请求封装
  widgets/       插件式小部件
```

推荐把新业务优先放在 `src/modules/<ModuleName>` 下，模块内再拆 `api / components / data / pages / store`。

## 模块模板约定

当前模板默认保留三个中性模块骨架，用来承载最常见的后台起步场景：

- `Auth`
  负责登录、会话、权限入口和鉴权相关页面骨架
- `Catalog`
  负责列表、搜索、创建、状态切换这类资源目录页面骨架
- `Detail`
  负责资源详情页、分区信息块、侧栏辅助信息这类详情展示骨架

这三个模块不是固定业务模型，而是模板层面的页面原型：

- `Auth` 适合替换成你的登录、注册、单点登录、组织切换等入口模块
- `Catalog` 适合替换成用户列表、订单列表、项目列表、任务列表等目录页
- `Detail` 适合替换成详情页、分析页、概览页、追踪页等内容页

建议约定：

- 一个模块优先按 `api / components / data / pages / store` 分层
- `pages/index.vue` 作为模块主页面入口
- 共享状态尽量放在 `src/store`
- 模块自身只保留局部 UI 组件和局部常量
- 如果某模块已经脱离模板范畴，优先直接重命名成真实业务名称

## 快速开始

### 环境要求

- `Node >= 22.12`
- `pnpm >= 9`

### 安装依赖

```bash
pnpm install
```

### 初始化模板

新项目建议在第一次拉起前先执行一次模板初始化脚本：

```bash
pnpm init:template -- --name my-admin-app --title "My Admin App" --repo https://github.com/you/my-admin-app
```

可选参数：

```bash
pnpm init:template -- \
  --name my-admin-app \
  --title "My Admin App" \
  --zh-title "我的后台系统" \
  --repo https://github.com/you/my-admin-app \
  --description "My personal admin starter" \
  --author "Your Name <you@example.com>"
```

这个脚本会自动更新：

- `package.json` 中的 `name / description / author / homepage / repository / bugs`
- 系统标题常量
- 中文系统标题文案
- 页脚仓库链接
- `README` 顶部标题

### 启动开发环境

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

## 常用脚本

```bash
pnpm lint
pnpm lint:fix
pnpm stylelint
pnpm stylelint:fix
pnpm format
pnpm format:check
pnpm type-check
pnpm test
pnpm test:coverage
```

## 开发约定

### 1. 新项目初始化时优先替换

- 先执行一次 `pnpm init:template`
- `src/locales/lang/*` 中的文案
- `src/router/*` 中的业务路由
- `src/modules/*` 中的示例模块骨架
- `src/utils/request.ts` 中的请求策略
- `src/styles/*` 中的主题变量
- `public/` 与 `src/assets/` 中的品牌资源

### 2. 当前模板保留的示例能力

- 登录页骨架
- 列表页骨架
- 详情页骨架
- 多语言切换
- 模态弹窗式表单

这些示例是为了帮助新项目快速替换，不建议直接把业务内容原样带入正式项目。

### 3. 状态管理策略

当前模板默认使用 `Pinia`，页面和会话、列表、详情状态都以组合式 store 的方式组织，便于在新项目里继续拆分和复用。

## 多语言

默认语言和可选语言定义在 [src/locales/index.ts](src/locales/index.ts)。

新增语言时通常需要做三件事：

1. 在 `localesMapping` 中注册语言
2. 在 `src/locales/lang/` 下增加语言文件
3. 合并对应的 `Element Plus` locale

## 提交规范

仓库启用了：

- `husky`
- `lint-staged`
- `commitlint`

提交时会自动执行必要检查，提交信息建议使用 Conventional Commits，例如：

```text
feat: add dashboard starter module
fix: correct request header typing
chore: refine template docs
```

## 当前验证状态

在当前仓库版本上，以下检查已通过：

- `oxlint --vue-plugin .`
- `vue-tsc --noEmit`
- `vitest --run`
- `vite build --mode prod`

## 后续可继续演进的方向

- 提供一版 `Pinia` 分支
- 提供更轻量的无 i18n 版本
- 抽离更通用的 `api` 类型定义
- 进一步清理示例业务内容，只保留页面骨架
- 增加 CI 工作流与模板初始化检查
