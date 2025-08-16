import type { Component } from "vue";

export interface MenuItem {
  label: string;
  index: string;
  routerPath: string;
  showLink?: boolean;
  permission?: boolean;
  icon?: string;
  children?: childrenItem[];
}
export interface childrenItem {
  label: string;
  index: string;
  showLink?: boolean;
  icon?: string;
  permission?: boolean; // 权限
  routerPath: string;
}

export interface RouteItem {
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
