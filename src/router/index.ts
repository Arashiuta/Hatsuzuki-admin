import { createRouter, createWebHashHistory } from "vue-router";
import { useStore } from "@/store";
import DefaultLayoutComponent from "@/layout/home/index.vue";
import { routeList } from "@/router/routeList";

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
  ...routeList,
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem("user");
  if (to.path !== "/login" && !user) {
    next("/login");
  } else {
    const store = useStore();
    if (!store.user) store.getUser();
    next();
  }
});
