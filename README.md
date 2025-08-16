![hatsuzuki](https://github.com/user-attachments/assets/12014986-ce8b-4782-ab71-1dc23d401b25)

<div align="center">
  <h1>Hatsuzuki-admin</h1>
  <span>一个也许会更新的轻量化后台管理系统模板</span>
</div>

---

# ✨ 项目介绍

**Hatsuzuki-admin** 是一个轻量级的后台管理系统模板，它基于以下现代前端技术栈构建：

* **Vue 3**：渐进式 JavaScript 框架
* **Vite**：下一代前端工具，极速的开发体验
* **TypeScript**：为项目提供强类型支持，增强代码健壮性
* **Pinia**：全新 Vue 状态管理库，简单易用
* **Vue Router**：用于处理页面路由

本模板提供了简单而基础的封装，项目结构清晰，方便进行二次开发和个性化定制。

# 🚀 快速开始

克隆项目到本地，并使用你喜欢的包管理器进行安装和启动。

```
npm i
npm run dev
```
启动后，在浏览器中访问 http://localhost:3001 即可看到项目界面。

## ⚙️ 项目结构

```txt
├── public/                 # 存放静态资源
├── src/                    # 项目源码目录
│   ├── api/                # API 请求相关模块
│   ├── assets/             # 静态资源，如图片、SVG 等，通常会被打包工具处理
│   ├── components/         # 通用组件，可在多个页面或模块复用的小组件
│   ├── font/               # 字体文件
│   ├── layout/             # 页面布局组件，如整体框架、侧边栏、头部等
│   ├── router/             # 路由配置，定义应用的路由表
│   ├── service/            # 封装的请求服务
│   ├── store/              # 状态管理模块
│   ├── styles/             # 颜色主题定义
│   ├── utils/              # 工具函数，存放项目通用的辅助函数
│   ├── views/              # 视图组件，对应路由页面的大组件
│   ├── App.vue             # 应用根组件
│   ├── main.ts             # 应用入口文件，用于创建 Vue 实例、挂载插件等
│   ├── style.css           # 全局样式文件
│   └── vite-env.d.ts       # Vite 相关的 TypeScript 类型声明
├── .env                    # 默认环境变量配置文件
├── .env.development        # 开发环境环境变量配置文件
├── .env.production         # 生产环境环境变量配置文件
├── .gitignore              # Git 版本控制忽略文件
├── auto-imports.d.ts       # Volar 或 Unplugin-auto-import 自动导入的类型声明
├── components.d.ts         # Volar 或 Unplugin-vue-components 自动导入的组件类型声明
├── index.html              # 项目的入口 HTML 文件
├── package.json            # 项目及依赖的配置文件
├── tsconfig.app.json       # TypeScript 应用部分的配置
├── tsconfig.json           # TypeScript 基础配置
├── tsconfig.node.json      # TypeScript Node.js 环境配置 (通常用于 Vite 配置文件等)
└── vite.config.ts          # Vite 构建工具的配置文件
```

## 📝 使用说明

### 环境变量

项目使用`.env`文件来管理环境变量`.env.development`和`.env.production`分别对应开发环境和生产环境的变量，`VITE_BASE_API`变量用来对接口请求进行代理，在`vite.config.ts`文件里面修改代理地址：

```typescript
server: {
    host: "0.0.0.0",
    port: 3000, //本地启动端口
    proxy: {
      "/api": {
        target: "http://example:port", //代理地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
```

axios 配置如下：

```typescript
export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, //这里使用了`VITE_BASE_API`变量
  timeout: 1000 * 60,
});
```

### 路由管理

左侧菜单会根据路由配置自动创建,
路由配置位于`src/router/routes.ts`文件中
`src/router/index.ts`文件内包含了登录界面、首页的路由以及路由守卫的配置。

#### 创建一级路由

```typescript
{
    path: "/home",
    name: "Home",
    component: DefaultLayoutComponent, //必须要携带此组件
    meta: {
      icon: "@/assets/menuIcon/welcome.png", //菜单的图标
    },
    children: [
      {
        path: "index",
        name: "HomeIndex",
        component: () => import("@/views/welcome/index.vue"), //路由的页面
        meta: {
          title: "首页", //菜单的标题
          showLink: true, //是否展示此菜单
        },
      },
    ],
  }
```

#### 创建二级路由

```typescript
 {
    path: "/form",
    name: "Form",
    component: DefaultLayoutComponent, //必须要携带此组件
    meta: {
      title: "表单", //折叠菜单标题
      icon: "@/assets/menuIcon/welcome.png", //菜单图标
    },
    children: [
      {
        path: "index",
        name: "FormIndex",
        component: () => import("@/views/form/index.vue"), //菜单组件
        meta: {
          title: "报告列表", //菜单标题
          showLink: true, //是否展示此菜单
        },
      },
      {
        path: "example",
        name: "FormExample",
        component: () => import("@/views/example/index.vue"),
        meta: {
          title: "二级路由示例",
          showLink: true,
        },
      },
    ],
  },
```

#### 路由配置
```typescript
interface RouteItem {
  path: string;
  redirect?: string;
  name?: string;
  component?: Function | Component;
  children?: RouteItem[] | null;
  meta?: {
    title?: string; // 路由标题
    showLink?: boolean; // 是否显示
    icon?: string; // 图标地址
    roles?: string[]; // 可以访问的角色权限 例['admin', 'user']
    [key: string]: any;
  };
}
```

### 状态管理

项目使用[Pinia](https://pinia.vuejs.org/)进行状态管理,在`src/store`目录下管理 pinia

# 🎨 内置组件

项目内置了一些简单组件可以调用，在`src/components`文件夹查看组件代码。`global`文件夹内为全局注册的组件，可以直接调用，`range`文件夹内的组件需要引入使用

## `global`组件

-----

### `<hz-button>` 组件

这是一个简单的按钮组件，提供了多种类型、尺寸和禁用状态，以满足不同的交互需求。

#### 属性 (Props)

| 属性名     | 类型                   | 默认值      | 说明                   |
| :--------- | :--------------------- | :---------- | :--------------------- |
| `type`     | `'primary' \| 'normal'` | `'primary'` | 按钮的样式类型。`'primary'` 为主题色按钮，`'normal'` 为带有边框的普通按钮。 |
| `size`     | `'default' \| 'large'` | `'default'` | 按钮的尺寸。`'default'` 为常规尺寸，`'large'` 为大尺寸。 |
| `disabled` | `boolean`              | `false`     | 控制按钮是否禁用。禁用状态下按钮不可点击，且样式会变暗。 |

#### 插槽 (Slot)

组件支持默认插槽，用于插入按钮的文本或图标。

```html
<!-- 带有文本的按钮 -->
<hz-button>点击我</hz-button>

<!-- 带有图标和文本的按钮 -->
<hz-button>
  <i class="el-icon-plus"></i>
  <span>添加</span>
</hz-button>
```

#### 使用示例

**基础用法**

```html
<!-- 默认样式（primary） -->
<hz-button>主要按钮</hz-button>

<!-- normal 类型按钮 -->
<hz-button type="normal">普通按钮</hz-button>
```

**不同尺寸**

```html
<!-- 默认尺寸 -->
<hz-button>默认尺寸</hz-button>

<!-- large 尺寸 -->
<hz-button size="large">大尺寸按钮</hz-button>
```

**禁用状态**

```html
<!-- 禁用按钮 -->
<hz-button disabled>禁用按钮</hz-button>
```

-----

### `<hz-dialog>` 组件

该组件是对 Element Plus 的 `el-dialog` 进行了封装，主要功能是提供一个带有自定义按钮和插槽的弹窗。

#### 属性 (Props)

| 属性名        | 类型      | 默认值    | 说明                   |
| :------------ | :-------- | :-------- | :--------------------- |
| `closeText`   | `string`  | `'取消'`  | 取消按钮的文本内容。   |
| `confirmText` | `string`  | `'确认'`  | 确认按钮的文本内容。   |
| `showFooter`  | `boolean` | `true`    | 是否显示底部按钮区域。 |
| `disabled`    | `boolean` | `false`   | 控制确认按钮是否禁用。 |

#### 事件 (Events)

| 事件名      | 说明                     |
| :---------- | :----------------------- |
| `confirm`   | 点击确认按钮时触发。     |
| `close`     | 点击取消按钮时触发。     |

#### 插槽 (Slot)

组件支持默认插槽，用于插入对话框的主体内容。

```html
<hz-dialog>
  <template #default>
    <!-- 这里是弹窗的内容 -->
    <p>这是一个弹窗内容</p>
  </template>
</hz-dialog>
```

#### 暴露方法 (Exposed Methods)

组件通过 `defineExpose` 暴露了两个方法，可以在父组件中通过 `ref` 调用来控制弹窗的显示与隐藏。

| 方法名        | 说明                   |
| :------------ | :--------------------- |
| `openDialog`  | 打开对话框。           |
| `closeDialog` | 关闭对话框。           |

#### 使用示例

```vue
<template>
  <div>
    <hz-button @click="handleOpen">打开弹窗</hz-button>

    <hz-dialog ref="dialogRef" @confirm="handleConfirm" @close="handleClose">
      <h3>这是一个自定义的弹窗标题</h3>
      <p>这是弹窗的主体内容。</p>
    </hz-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dialogRef = ref();

const handleOpen = () => {
  dialogRef.value.openDialog();
};

const handleConfirm = () => {
  console.log('点击了确认按钮');
  dialogRef.value.closeDialog();
};

const handleClose = () => {
  console.log('点击了取消按钮');
};
</script>
```

-----


### `<hz-pagination>` 组件

该组件是对 Element Plus 的 `el-pagination` 进行了封装，用于在表格或列表中实现分页功能，并提供了更友好的展示文本。

#### 属性 (Props)

| 属性名          | 类型          | 默认值    | 说明                                     |
| :-------------- | :------------ | :-------- | :--------------------------------------- |
| `currentPage`   | `number`      | —         | 当前页码，**必须使用 `v-model` 双向绑定**。 |
| `pageSize`      | `number`      | —         | 每页显示条数，**必须使用 `v-model` 双向绑定**。 |
| `total`         | `number`      | —         | 总条数。                                 |
| `pageCapacity`  | `number[]`    | `[20, 30, 50]` | 可选的每页显示条数。                     |

#### 事件 (Events)

| 事件名            | 说明                               |
| :---------------- | :--------------------------------- |
| `update:currentPage` | 当当前页码改变时触发。             |
| `update:pageSize` | 当每页显示条数改变时触发。         |
| `change`          | 无论是页码还是每页条数改变时都会触发。 |

#### 使用示例

```vue
<template>
  <div>
    <!-- 使用 v-model 双向绑定分页数据 -->
    <hz-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      :page-capacity="[10, 20, 30]"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const pagination = ref({
  currentPage: 1,
  pageSize: 20,
  total: 100,
});

const handlePageChange = (currentPage: number, pageSize: number) => {
  console.log(`当前页码: ${currentPage}, 每页条数: ${pageSize}`);
  // 这里可以执行你的数据请求逻辑
};
</script>
```

-----


### `<hz-tableFramework>` 组件

这是一个用于封装表格页面的通用框架组件。它集成了筛选、搜索、重置、表格内容以及分页功能，旨在简化后台管理系统中列表页面的开发。

#### 属性 (Props)

| 属性名          | 类型        | 默认值          | 说明                                             |
| :-------------- | :---------- | :-------------- | :----------------------------------------------- |
| `currentPage`   | `number`    | —               | 当前页码，**必须使用 `v-model` 双向绑定**。        |
| `pageSize`      | `number`    | —               | 每页显示条数，**必须使用 `v-model` 双向绑定**。    |
| `total`         | `number`    | —               | 总条数。                                         |
| `pageCapacity`  | `number[]`  | `[20, 30, 50]`  | 可选的每页显示条数。                             |

#### 事件 (Events)

| 事件名                | 说明                                             |
| :-------------------- | :----------------------------------------------- |
| `search`              | 点击 **搜索** 按钮时触发。通常用于发起数据请求。 |
| `reset`               | 点击 **重置** 按钮时触发。用于清空筛选条件。   |
| `update:currentPage`  | 当页码改变时触发。                               |
| `update:pageSize`     | 当每页条数改变时触发。                           |
| `changePage`          | 当页码或每页条数改变时触发。                   |

#### 插槽 (Slots)

| 插槽名      | 作用                                                     |
| :---------- | :------------------------------------------------------- |
| `default`   | **必填**。用于放置主要的表格内容。                       |
| `screen`    | 用于放置筛选条件的表单项，例如 `el-input`、`el-select` 等。 |
| `operation` | 可选。如果使用此插槽，将替换掉默认的搜索、重置和筛选区域，用于自定义操作栏。 |
| `footer`    | 可选。用于放置表格下方的自定义内容，如批量操作按钮等。     |

#### 使用示例

```vue
<template>
  <div class="page-container">
    <hz-table-framework
      v-model:currentPage="pagination.currentPage"
      v-model:pageSize="pagination.pageSize"
      :total="pagination.total"
      @search="handleSearch"
      @reset="handleReset"
      @change-page="handlePageChange"
    >
      <template #screen>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
      </template>

      <template #default>
        <el-table :data="tableData">
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </template>

    </hz-table-framework>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const pagination = ref({
  currentPage: 1,
  pageSize: 20,
  total: 100,
});

const searchForm = ref({
  name: '',
  status: '',
});

const tableData = ref([]);

// 模拟获取数据的方法
const fetchData = () => {
  // 根据 pagination 和 searchForm 发起 API 请求
  console.log('发起请求', pagination.value, searchForm.value);
  // 假数据
  tableData.value = [
    { date: '2023-01-01', name: 'Tom', address: '上海市' },
    { date: '2023-01-02', name: 'Jerry', address: '北京市' },
  ];
  // 更新总条数
  pagination.value.total = 50;
};

// 搜索事件
const handleSearch = () => {
  pagination.value.currentPage = 1; // 搜索时重置页码
  fetchData();
};

// 重置事件
const handleReset = () => {
  searchForm.value = { name: '', status: '' };
  pagination.value.currentPage = 1;
  fetchData();
};

// 分页改变事件
const handlePageChange = () => {
  fetchData();
};

onMounted(() => {
  fetchData();
});
</script>
```

-----

## `range`组件

### `<hz-previewPdf>` 组件

这是一个用于在线预览 PDF 文件的组件。它基于 `pdfjs-dist` 实现，提供了放大、缩小、移动、翻页等基本操作功能。

#### 属性 (Props)

| 属性名 | 类型     | 默认值 | 说明                           |
| :----- | :------- | :----- | :----------------------------- |
| `path` | `string` | —      | **必填**。PDF 文件的在线访问路径。 |

#### 暴露方法 (Exposed Methods)

组件通过 `defineExpose` 暴露了一个方法，用于在父组件中手动销毁 PDF 实例。

| 方法名      | 说明                     |
| :---------- | :----------------------- |
| `destroyPdf` | 销毁当前的 PDF 实例。在组件卸载时调用，可以帮助释放内存。 |

#### 使用示例

```vue
<template>
  <div class="pdf-wrapper">
    <hz-preview-pdf path="https://example.com/your-document.pdf" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 在实际项目中，你可能需要动态传入这个 path
const pdfPath = ref('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
</script>

<style scoped>
.pdf-wrapper {
  width: 800px; /* 控制预览区域的宽度 */
  height: 600px; /* 控制预览区域的高度 */
  border: 1px solid #e0e0e0;
}
</style>
```

#### 💡 注意事项

  * **路径**：`path` 属性必须是一个完整的、可在线访问的 PDF 文件路径。
  * **依赖**：该组件依赖于 `pdfjs-dist`，请确保你的项目中已正确安装和配置。
  * **样式**：组件本身会自动撑满父容器，所以你需要通过父容器的样式来控制预览区域的尺寸。

-----


## 📄 许可证

本项目使用 MIT 许可证。详见 [LICENSE](https://github.com/Arashiuta/Hatsuzuki-admin/blob/main/LICENSE) 文件。

---

## 更新中...
