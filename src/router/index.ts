import { createRouter, createWebHashHistory } from "vue-router";
import { useStore } from "@/store";
import DefaultLayoutComponent from "@/layout/home/index.vue";
import { routelist } from "@/router/rotes";
import { ElMessage } from "element-plus";
import type { RouteItem } from "@/layout/home/components/menu/types";

export const routes = [
  { path: "/", redirect: "/home/index" },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/layout/login/index.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/home",
    name: "Home",
    component: DefaultLayoutComponent,
    meta: {
      icon: "src/assets/menuIcon/welcome.svg",
    },
    children: [
      {
        path: "index",
        name: "HomeIndex",
        component: () => import("@/views/welcome/index.vue"),
        meta: {
          title: "首页",
          showLink: true,
        },
      },
    ],
  },
  ...routelist,
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const store = useStore();
  const user = store.getUser();
  if (to.path !== "/login" && !user) {
    ElMessage.error("用户未登录");
    next("/login");
  }
  //判断跳转权限
  let roles: string[] = [];
  to.matched.forEach((item) => {
    if (item.meta?.roles && Array.isArray(item.meta.roles)) {
      roles = [...roles, ...item.meta.roles];
    }
  });
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    ElMessage.error("没有权限访问该页面");
    next("/home/index");
    return;
  }
  next();
});
