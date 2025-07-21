![hatsuzuki](https://github.com/user-attachments/assets/12014986-ce8b-4782-ab71-1dc23d401b25)

<div align="center">
  <h1>Hatsuzuki-admin</h1>
  <span>一个也许会更新的轻量化后台管理系统模板</span>
</div>

---

# ✨ 项目介绍
`Hatsuzuki-admin`是一个轻量化的后台管理系统模板，项目仅做了简单并且基础的封装，项目结构简单，对于项目的定制化修改相当方便
> 写了好多个后台管理项目了，对于较大的项目确实有很多优秀且成熟的管理系统模板，但是对于一些只有几个页面的超小型项目来说还是大材小用了，并且对于ui定制化强一些的项目修改比较困难。<br>
> 在某次小型管理项目结束后我决定把项目框架留下来作为备用，避免重复造轮子。

# 🚀 快速开始
**使用你的包管理器进行安装**
```
npm i
npm run dev
```
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
axios配置如下：
```typescript
export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, //这里使用了`VITE_BASE_API`变量
  timeout: 1000 * 60,
});
```
### 路由管理
左侧菜单会根据路由配置自动创建，路由配置说明如下：
在`src/router`文件夹下的`routeList.ts`文件内配置路由
> `index.ts`文件内是登录界面和首页的路由，并且可以在此文件内配置路由守卫和修改基础路由配置。

#### 创建一级路由
```typescript
{
    path: "/home",
    name: "Home",
    component: DefaultLayoutComponent, //必须要携带此组件
    meta: {
      icon: "/menuIcon/welcome.png", //菜单的icon
    },
    children: [
      {
        path: "index",
        name: "HomeIndex",
        component: () => import("@/views/welcome/index.vue"), //路由的页面
        meta: {
          title: "首页", //菜单的title
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
      icon: "/menuIcon/welcome.png", //菜单icon
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
### 状态管理
项目使用[Pinia](https://pinia.vuejs.org/)进行状态管理,在`src/store`目录下管理pinia

# 🎨 内置组件
项目内置了一些简单组件可以调用，在`src/components`文件夹查看组件代码。`global`文件夹内为全局注册的组件，可以直接调用，`range`文件夹内的组件需要引入使用


## 📄 许可证
本项目使用 MIT 许可证。详见 [LICENSE](https://github.com/Arashiuta/Hatsuzuki-admin/blob/main/LICENSE) 文件。

---
更新中...
---


