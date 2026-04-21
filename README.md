![hatsuzuki](https://github.com/user-attachments/assets/12014986-ce8b-4782-ab71-1dc23d401b25)

<div align="center">
  <h1>Hatsuzuki-admin</h1>
  <span>一个轻量化、可快速二次开发的 Vue 3 后台管理模板</span>
</div>

---

## 🔖 快速跳转

- [✨ 项目简介](#-项目简介)
- [🧰 技术栈](#-技术栈)
- [📦 安装与启动](#-安装与启动)
- [⚙️ 环境变量与代理](#️-环境变量与代理)
- [📁 项目结构](#-项目结构)
- [🧭 路由配置文档（重点）](#-路由配置文档重点)
- [🔐 登录与权限（RBAC）](#-登录与权限rbac)
- [🌐 请求层与 Token 刷新](#-请求层与-token-刷新)
- [🗃️ 状态管理](#️-状态管理)
- [🧩 组件使用文档（重点）](#-组件使用文档重点)
- [🚀 部署说明](#-部署说明)
- [📄 许可证](#-许可证)

---

## ✨ 项目简介

**Hatsuzuki-admin** 是一个基于 Vue 3 + Element Plus 的后台管理模板，内置了：

- 登录页与路由守卫
- 动态菜单生成
- 路由级角色权限（RBAC）
- Axios 请求封装与 401 自动刷新 token
- 一组后台常用组件（按钮、弹窗、分页、列表框架、PDF 预览）

适合：

- 作为新后台项目脚手架快速起步
- 作为团队内部统一管理端模板
- 作为教学/演示项目了解 Vue3 中后台典型实现

---

## 🧰 技术栈

- **Vue 3.5**（Composition API）
- **Vite 7**
- **TypeScript 5**
- **Vue Router 4**
- **Pinia 3**
- **Element Plus 2**
- **Axios 1**
- **ECharts 5**
- **pdfjs-dist 5**

---

## 📦 安装与启动

### 1) 安装依赖

```bash
npm install
```

### 2) 本地开发

```bash
npm run dev
```

默认端口：`3001`  
默认地址：`http://localhost:3001`

### 3) 生产构建

```bash
npm run build
```

### 4) 本地预览构建产物

```bash
npm run preview
```

---

## ⚙️ 环境变量与代理

### 1) API 基地址

项目请求实例在 `src/service/index.ts` 中使用：

```ts
baseURL: import.meta.env.VITE_BASE_API
```

建议在根目录添加 `.env.development`：

```env
VITE_BASE_API=/api
```

### 2) Vite 代理

`vite.config.ts` 中已经提供 `/api` 代理示例：

```ts
server: {
  host: '0.0.0.0',
  port: 3001,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3001',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

> 后端地址变更时，只需改 `target`。

---

## 📁 项目结构

```txt
.
├── public/
├── src/
│   ├── api/                      # 接口定义（当前示例包含 mock 登录）
│   ├── assets/                   # 图片、图标等资源
│   ├── components/
│   │   ├── global/               # 全局组件（main.ts 注册）
│   │   └── range/                # 按需组件
│   ├── layout/                   # 登录页 + 后台主框架 + 菜单/头部
│   ├── router/                   # 路由主入口 & 业务路由表
│   ├── service/                  # axios 拦截器与请求实例
│   ├── store/                    # pinia 全局状态
│   ├── styles/                   # 主题样式
│   ├── utils/                    # 工具函数（token/time/download...）
│   └── views/                    # 页面
├── mock/                         # mock 数据
├── vite.config.ts
└── package.json
```

---

## 🧭 路由配置文档（重点）

> 本章节可作为“路由使用手册”。

### 1) 路由文件分工

- `src/router/index.ts`：
  - 定义基础路由（`/login`、`/home`）
  - 合并业务路由
  - 配置全局前置守卫
- `src/router/rotes.ts`：
  - 业务菜单路由配置入口（当前文件名为 `rotes`）

### 2) 路由对象约定

推荐按项目内已有 `RouteItem` 结构组织：

```ts
interface RouteItem {
  path: string;
  redirect?: string;
  name?: string;
  component?: Function | Component;
  children?: RouteItem[] | null;
  meta?: {
    title?: string;      // 菜单名称
    showLink?: boolean;  // 是否在左侧菜单显示
    icon?: string;       // 菜单图标
    roles?: string[];    // 允许访问角色
    [key: string]: any;
  };
}
```

### 3) 一级菜单路由写法（单页面）

当某个模块只有一个子页面时，可以写成一个父路由 + 1 个 children，菜单将显示为一级菜单。

```ts
import DefaultLayoutComponent from '@/layout/home/index.vue';

{
  path: '/report',
  name: 'Report',
  component: DefaultLayoutComponent,
  meta: {
    icon: 'src/assets/menuIcon/form.svg',
  },
  children: [
    {
      path: 'index',
      name: 'ReportIndex',
      component: () => import('@/views/report/index.vue'),
      meta: {
        title: '报告中心',
        showLink: true,
      },
    },
  ],
}
```

访问路径：`/report/index`

### 4) 二级菜单路由写法（折叠菜单）

当某个模块有多个页面时，菜单会渲染为一个 `el-sub-menu`。

```ts
{
  path: '/system',
  name: 'System',
  component: DefaultLayoutComponent,
  meta: {
    title: '系统管理',
    icon: 'src/assets/menuIcon/form.svg',
  },
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/system/user.vue'),
      meta: {
        title: '用户管理',
        showLink: true,
      },
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/system/role.vue'),
      meta: {
        title: '角色管理',
        showLink: true,
      },
    },
  ],
}
```

访问路径示例：`/system/user`、`/system/role`

### 5) 如何启用/隐藏菜单

通过 `meta.showLink` 控制菜单是否展示：

```ts
meta: {
  title: '仅路由可访问页',
  showLink: false,
}
```

适用于：详情页、编辑页等不希望在菜单中直接显示的页面。

### 6) 图标字段约定

当前菜单组件读取 `meta.icon` 并使用 `<img>` 渲染。  
建议使用 `src/assets/menuIcon/*.svg` 路径。

### 7) 路由新增完整步骤（推荐流程）

1. 在 `src/views` 创建页面组件，例如 `src/views/system/user.vue`。
2. 在 `src/router/rotes.ts` 新增路由对象。
3. 设置 `meta.title/showLink/icon/roles`。
4. 启动项目验证左侧菜单是否自动出现。
5. 如页面受权限控制，确认测试账户中 `user.role` 是否匹配。

### 8) 常见问题（路由）

- **菜单不显示？**
  - 检查 `meta.showLink` 是否为 `true`
  - 检查是否有权限（`meta.roles`）
  - 检查是否正确写在 `routelist` 中
- **点击菜单跳转失败？**
  - 检查 `children.path` 是否和页面文件路径一致
  - 检查页面组件是否存在且 `import` 路径正确

---

## 🔐 登录与权限（RBAC）

### 1) 登录拦截

全局前置守卫逻辑：

- 访问非 `/login` 页面时，如果本地没有用户信息，跳转 `/login`

### 2) 角色权限拦截

守卫会收集命中路由的 `meta.roles`：

- 若配置了 `roles` 且当前 `user.role` 不在允许列表中，则拒绝访问并跳转首页。

示例：

```ts
meta: {
  title: '审计日志',
  showLink: true,
  roles: ['admin', 'auditor'],
}
```

### 3) 用户对象要求

至少需要：

```ts
{
  role: 'admin'
}
```

并写入 `localStorage`（项目内 `store.getUser()` 会读取）。

---

## 🌐 请求层与 Token 刷新

`src/service/index.ts` 中已实现：

1. 请求拦截器自动注入 `Authorization`。
2. 统一处理响应数据（返回 `response.data`）。
3. 收到 `401` 时自动尝试 `refresh-token`。
4. 刷新期间进入队列的请求会等待刷新完成后自动重放。
5. 刷新失败时清除 token 并跳转登录页。

token 工具函数在 `src/utils/tokenUtils.ts`：

- `setTokens(accessToken, refreshToken, expiresIn)`
- `getAccessToken()`
- `getRefreshToken()`
- `removeTokens()`

---

## 🗃️ 状态管理

`src/store/index.ts` 当前提供：

- `user`：用户信息
- `pageProgress`：页面加载进度（请求时更新）
- `loginExpired`：登录失效标识（避免重复提示）

常用方法：

- `setUser(info)`
- `getUser()`
- `startProgress()`
- `finishProgress()`

---

## 🧩 组件使用文档（重点）

> 本章节可直接作为组件说明书使用。

### 全局注册说明

以下组件已在 `src/main.ts` 全局注册，可直接在任意页面使用：

- `hz-table-framework`
- `hz-button`
- `hz-pagination`
- `hz-dialog`

---

### 1) `hz-button`

一个轻量样式按钮容器组件。

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `type` | `'primary' \| 'normal'` | `'primary'` | 按钮风格 |
| `size` | `'default' \| 'large'` | `'default'` | 按钮尺寸 |
| `disabled` | `boolean` | `false` | 是否禁用 |

#### Slot

- 默认插槽：按钮内容（文本/图标）

#### 示例

```vue
<template>
  <div style="display: flex; gap: 10px;">
    <hz-button>主要按钮</hz-button>
    <hz-button type="normal">普通按钮</hz-button>
    <hz-button size="large">大按钮</hz-button>
    <hz-button :disabled="true">禁用按钮</hz-button>
  </div>
</template>
```

---

### 2) `hz-dialog`

对 `el-dialog` 的简单封装，支持自定义底部按钮及 `ref` 控制开关。

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `closeText` | `string` | `'取消'` | 取消按钮文本 |
| `confirmText` | `string` | `'确认'` | 确认按钮文本 |
| `showFooter` | `boolean` | `true` | 是否显示底部按钮 |
| `disabled` | `boolean` | `false` | 确认按钮是否禁用 |

#### Events

| 事件名 | 说明 |
|---|---|
| `confirm` | 点击确认按钮触发 |
| `close` | 点击取消按钮触发 |

#### Expose

| 方法 | 说明 |
|---|---|
| `openDialog()` | 打开弹窗 |
| `closeDialog()` | 关闭弹窗 |

#### 示例

```vue
<template>
  <hz-button @click="open">打开弹窗</hz-button>

  <hz-dialog
    ref="dialogRef"
    confirmText="提交"
    closeText="取消"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <h3>操作确认</h3>
    <p>确认执行当前操作吗？</p>
  </hz-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const dialogRef = ref();

const open = () => dialogRef.value.openDialog();

const handleConfirm = () => {
  ElMessage.success('提交成功');
  dialogRef.value.closeDialog();
};

const handleClose = () => {
  ElMessage.info('已取消');
};
</script>
```

---

### 3) `hz-pagination`

分页组件，支持 `v-model:currentPage` 与 `v-model:pageSize`。

#### Props

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `currentPage` | `number` | 是 | - | 当前页 |
| `pageSize` | `number` | 是 | - | 每页条数 |
| `total` | `number` | 是 | - | 总条数 |
| `pageCapacity` | `number[]` | 否 | `[20,30,50]` | 每页条数选项 |

#### Events

| 事件名 | 参数 | 说明 |
|---|---|---|
| `update:currentPage` | `(currentPage)` | 页码变化 |
| `update:pageSize` | `(pageSize)` | 每页条数变化 |
| `change` | `(currentPage, pageSize)` | 任一分页参数变化 |

#### 示例

```vue
<template>
  <hz-pagination
    v-model:currentPage="page.currentPage"
    v-model:pageSize="page.pageSize"
    :total="page.total"
    :pageCapacity="[10, 20, 50]"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const page = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 235,
});

const handleChange = (currentPage: number, pageSize: number) => {
  console.log('分页变化', { currentPage, pageSize });
};
</script>
```

---

### 4) `hz-table-framework`

后台列表页通用容器组件，封装了：

- 筛选区域
- 默认操作栏（重置 + 搜索）
- 表格主体区域
- 分页
- 可选 footer

#### Props

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `currentPage` | `number` | 是 | - | 当前页 |
| `pageSize` | `number` | 是 | - | 每页条数 |
| `total` | `number` | 是 | - | 总条数 |
| `pageCapacity` | `number[]` | 否 | `[20,30,50]` | 分页容量 |

#### Events

| 事件名 | 参数 | 说明 |
|---|---|---|
| `search` | - | 点击搜索按钮 |
| `reset` | - | 点击重置按钮 |
| `update:currentPage` | `(currentPage)` | 当前页变化 |
| `update:pageSize` | `(pageSize)` | 每页条数变化 |
| `changePage` | `(currentPage, pageSize)` | 分页变化 |

#### Slots

| 插槽名 | 说明 |
|---|---|
| `screen` | 筛选条件区域 |
| `operation` | 自定义整个操作栏（会替换默认搜索区） |
| `button` | 默认操作栏右侧扩展按钮 |
| `default` | 主体内容（一般放 `el-table`） |
| `footer` | 底部扩展区域 |

#### 示例（推荐模板）

```vue
<template>
  <hz-table-framework
    v-model:currentPage="screen.current"
    v-model:pageSize="screen.size"
    :total="total"
    @search="onSearch"
    @reset="onReset"
    @changePage="onChangePage"
  >
    <!-- 筛选区 -->
    <template #screen>
      <el-form-item label="关键词">
        <el-input v-model="screen.keyword" placeholder="请输入关键词" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="screen.status" style="width: 180px">
          <el-option label="启用" value="1" />
          <el-option label="停用" value="0" />
        </el-select>
      </el-form-item>
    </template>

    <!-- 右侧扩展按钮 -->
    <template #button>
      <hz-button type="normal" @click="onExport">导出</hz-button>
    </template>

    <!-- 主体 -->
    <template #default>
      <el-table :data="tableData">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="status" label="状态" />
      </el-table>
    </template>
  </hz-table-framework>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const screen = reactive({
  current: 1,
  size: 20,
  keyword: '',
  status: '',
});
const total = ref(0);
const tableData = ref<any[]>([]);

const fetchList = () => {
  // TODO: 调用接口并更新 tableData / total
};

const onSearch = () => {
  screen.current = 1;
  fetchList();
};

const onReset = () => {
  screen.keyword = '';
  screen.status = '';
  screen.current = 1;
  fetchList();
};

const onChangePage = (currentPage: number, pageSize: number) => {
  screen.current = currentPage;
  screen.size = pageSize;
  fetchList();
};

const onExport = () => {
  console.log('导出数据');
};
</script>
```

---

### 5) `hz-previewPdf`（按需引入）

用于在线预览 PDF，支持：

- 翻页
- 缩放
- 画布拖拽移动

#### 引入方式

```vue
<script setup lang="ts">
import HzPreviewPdf from '@/components/range/hz-previewPdf/index.vue';
</script>
```

#### Props

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `path` | `string` | 是 | PDF 在线地址 |

#### Expose

| 方法 | 说明 |
|---|---|
| `destroyPdf()` | 手动销毁 PDF 实例（释放资源） |

#### 示例

```vue
<template>
  <div style="width: 900px; height: 600px; border: 1px solid #eee;">
    <HzPreviewPdf ref="pdfRef" :path="pdfUrl" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import HzPreviewPdf from '@/components/range/hz-previewPdf/index.vue';

const pdfRef = ref();
const pdfUrl = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

onBeforeUnmount(() => {
  pdfRef.value?.destroyPdf?.();
});
</script>
```

#### 注意事项

- `path` 需要是可直接访问的 PDF 链接。
- 组件会撑满父容器，请务必给父容器明确宽高。

---

## 🚀 部署说明

如需部署到子路径（例如 GitHub Pages），可在 `vite.config.ts` 设置 `base`：

```ts
// base: '/Hatsuzuki-admin-preview/'
```

然后执行：

```bash
npm run build
```

将 `dist/` 部署到目标服务器即可。

---


## 📄 许可证

本项目基于 [MIT License](./LICENSE) 开源。

---

## 更新中...
