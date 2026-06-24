# 前端项目架构组织手册（当前模板定制版）

适用范围：

- 当前仓库 `vite-ts-starter`
- 技术栈：`Vue 3 + TypeScript + Vite + Element Plus + Pinia + UnoCSS`
- 组织方式：以 `modules/*` 领域聚合为主，同时保持清晰分层

## 1. 当前项目的架构决策

这个模板不再走“所有层都平铺在 `src/` 根目录”的方式，而是采用：

```text
src/
  api/
  composables/
  components/
  hooks/
  modules/
    Auth/
    Catalog/
    Detail/
  router/
  store/
  styles/
  utils/
```

其中业务代码优先按模块聚合，模块内部再分层：

```text
modules/<Domain>/
  api/
  composables/
  mappers/
  models/
  pages/
  services/
  store/
  components/
```

一句话规范：

`Page 负责展示和交互，Composable 负责页面逻辑，Store 负责共享状态，Service 负责业务编排，API 负责接口边界，Mapper 负责 DTO 和 Model 转换。`

## 2. 当前推荐目录结构

```text
.
  .husky/
  docs/
    frontend-architecture-checklist.md
  .oxlintrc.json
  .oxfmtrc.json
  lint-staged.config.js
  package.json
  stylelint.config.mjs
  uno.config.ts
  vite.config.ts
src/
  api/
    core/
    request.ts
  composables/
    useBaseStore.ts
    useCurrentInstance.ts
    useLanguage.ts
  components/
  hooks/
    useBaseStore.ts
    useLanguage.ts
  modules/
    Auth/
      api/
      composables/
      mappers/
      models/
      pages/
      services/
      store/
    Catalog/
      api/
      components/
      composables/
      mappers/
      models/
      pages/
      services/
      store/
    Detail/
      api/
      composables/
      mappers/
      models/
      pages/
      services/
      store/
  router/
    guards/
      auth.guard.ts
    routes/
      static.ts
      modules/
        auth.ts
        catalog.ts
        detail.ts
    index.ts
  store/
    index.ts
    useSessionStore.ts
    useCatalogStore.ts
    useDetailStore.ts
  styles/
  utils/
    request.ts
```

补充说明：

- `src/utils/request.ts` 目前作为兼容层保留，真实请求层已迁到 `src/api/request.ts`
- `src/composables/` 现在是全局通用组合能力的正式落点
- `src/hooks/` 暂时保留为兼容壳，避免一次性改动历史引用
- 页面目录当前沿用 `pages/`，不强制改名为 `views/`

## 3. 分层职责约定

### 3.1 `modules/*/pages`

职责：

- 组件拼装
- 绑定页面事件
- 使用模块 composable 输出页面状态

不应该做：

- 直接编排接口调用顺序
- 直接处理 DTO 字段转换
- 把整段表单/列表流程都塞进页面

### 3.2 `modules/*/composables`

职责：

- 承载页面级复用逻辑
- 管理 loading、提交、弹窗、初始化流程
- 连接 Page 和 Store

当前示例：

- `modules/Auth/composables/useAuthLogin.ts`
- `modules/Catalog/composables/useCatalogList.ts`
- `modules/Detail/composables/useDetailOverview.ts`

### 3.3 `store/`

职责：

- 共享状态
- 暴露对页面友好的 action
- 调用 `service`，不直接依赖模块 `api`

当前要求：

- `store` 不直接 import `modules/*/api`
- 页面私有弹窗状态不进入 `store`

### 3.4 `modules/*/services`

职责：

- 业务流程编排
- API 调用聚合
- DTO -> Model 转换

当前要求：

- `service` 调用 `api`
- `service` 调用 `mapper`
- `service` 输出给 `store` / `composable` 的是前端模型

### 3.5 `modules/*/api`

职责：

- 一条函数对应一个接口边界
- 返回服务端 DTO 形状
- 统一依赖 `src/api/request.ts` 或 `api/core/*`

当前模板状态：

- 现有示例数据接口已经改成返回 DTO
- 后续接真实后端时，优先替换这里，而不是把请求散到页面或 store

### 3.6 `modules/*/mappers`

职责：

- DTO -> Model
- Model -> DTO

当前示例：

- `Catalog` 使用 `resource_id` / `updated_at` 等 DTO 字段，再映射成前端模型
- `Detail` 使用 `panel_title` / `section_id` 等 DTO 字段，再映射成页面可用结构

### 3.7 `modules/*/models`

职责：

- 定义前端使用的数据模型
- 作为 store、composable、组件之间的稳定边界

## 4. 当前统一数据流

推荐统一为：

```text
Page -> Composable -> Store -> Service -> API -> Mapper -> Store/Page
```

说明：

- 页面不直接调底层请求
- store 不直接 import 模块 api
- API 不反向依赖 store 类型

## 5. 路由组织规范

当前项目采用：

```text
router/
  index.ts
  guards/
    auth.guard.ts
  routes/
    static.ts
    modules/
      auth.ts
      catalog.ts
      detail.ts
```

规则：

- `static.ts` 放根路由、404、多语言外壳路由
- `routes/modules/*.ts` 放业务模块路由
- `guards/*.ts` 只处理登录校验、标题设置、路由切换规则

Meta 约定：

- `title`
- `requiresAuth`
- `permission`

## 6. 当前工程化状态

### 6.1 已完成

- [x] 已配置 `@/` 路径别名
- [x] 已配置 `Oxlint`
- [x] 已配置 `Oxfmt`
- [x] 已配置 `Stylelint`
- [x] 已接入 `husky + lint-staged`
- [x] 已接入 `UnoCSS`
- [x] 已建立 `src/api/request.ts`
- [x] 已建立路由守卫与模块路由目录
- [x] 已在现有模块中补齐 `service`
- [x] 已在现有模块中补齐 `composables`
- [x] 已在现有模块中补齐 `mappers`
- [x] 已在现有模块中补齐 `models`

### 6.2 保留的兼容层

- [x] `src/utils/request.ts` 作为兼容导出保留
- [x] `src/router/permission.ts`、`src/router/routes.ts`、`src/router/child-routes.ts` 继续保留兼容导出
- [x] `src/hooks/useBaseStore.ts` 继续保留，避免一次性改动所有引用

### 6.3 仍可继续增强

- [x] 将更多通用 hook 从 `hooks/` 迁到更明确的 `composables/`
- [x] 为 `service` / `mapper` / `router meta` 增加更有针对性的测试
- [ ] 如果未来模块增多，可继续统一 `modules/<Domain>/components` 的命名与导出方式
- [ ] 如果引入真实后端，可逐步把 mock API 替换成基于 `src/api/request.ts` 的真实请求

## 7. 新增代码时的落地清单

新增一个页面或模块时，固定按下面顺序：

1. 先确定归属模块，比如 `modules/Order`
2. 建立 `models` 定义前端模型
3. 在 `api` 中定义接口边界和 DTO
4. 在 `mappers` 中做 DTO / Model 转换
5. 在 `services` 中编排业务流程
6. 在 `store` 中接入共享状态
7. 在 `composables` 中封装页面逻辑
8. 在 `pages` 中只做展示和交互接入
9. 在 `router/routes/modules/*.ts` 中注册路由
10. 补齐 `meta.title`、`requiresAuth`、`permission`

## 8. 当前项目禁止事项

- [ ] 页面直接调用底层请求库
- [ ] store 直接调用模块 api
- [ ] api 反向 import store 里的类型
- [ ] 页面或组件里散落 DTO 字段名转换
- [ ] 路由守卫里写页面专属业务逻辑
- [ ] 把所有复用逻辑继续堆回页面 SFC

## 9. 一页版速查

提交前先确认：

- [ ] 新逻辑是否先判断该放 `page / composable / store / service / api / mapper` 哪一层
- [ ] 页面是否只负责展示和交互
- [ ] store 是否没有直接依赖 `modules/*/api`
- [ ] API 是否没有依赖 store 类型
- [ ] DTO 转换是否进了 mapper
- [ ] 路由是否放到了 `router/routes/modules/*`
- [ ] 鉴权页面是否显式标注 `requiresAuth`
- [ ] 命名是否与当前模块保持一致

如果这几条长期成立，这个模板就能在继续扩展时保持可维护。
