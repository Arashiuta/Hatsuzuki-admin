import type { Component } from "vue";

declare interface MenuItem {
  label: string;
  index: string;
  routerPath: string;
  showLink?: boolean;
  icon?: string; // 图标
  children?: childrenItem[];
}
declare interface childrenItem {
  label: string;
  index: string;
  showLink?: boolean;
  routerPath: string;
}

declare interface RouteItem {
  path: string;
  redirect?: string;
  name?: string;
  component?: Function | Component;
  children?: RouteItem[] | null;
  meta?: { [key: string]: any };
}

export { MenuItem, RouteItem };
