import type { Component } from "vue";

export interface MenuItem {
  label: string;
  index: string;
  routerPath: string;
  showLink?: boolean;
  icon?: string; // 图标
  children?: childrenItem[];
}
export interface childrenItem {
  label: string;
  index: string;
  showLink?: boolean;
  routerPath: string;
}

export interface RouteItem {
  path: string;
  redirect?: string;
  name?: string;
  component?: Function | Component;
  children?: RouteItem[] | null;
  meta?: { [key: string]: any };
}
