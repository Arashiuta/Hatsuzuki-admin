import DefaultLayoutComponent from "@/layout/home/index.vue";

//路由页面在此添加
export const routeList = [
  {
    path: "/form",
    name: "Form",
    component: DefaultLayoutComponent,
    meta: {
      title: "表单",
      icon: "@/assets/menuIcon/form.svg",
    },
    children: [
      {
        path: "index",
        name: "FormIndex",
        component: () => import("@/views/form/index.vue"),
        meta: {
          title: "报告列表",
          showLink: true,
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
];
