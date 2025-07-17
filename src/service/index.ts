import axios from "axios";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";

export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 1000 * 10 * 60,
});

http.interceptors.request.use(
  (config) => {
    const store = useStore();
    store.startProgress();
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 请求错误处理
    const store = useStore();
    store.finishProgress();
    return Promise.reject(error);
  }
);

let loginErrorMessageShown = false;
http.interceptors.response.use(
  (response) => {
    // 响应数据处理
    const store = useStore();
    store.finishProgress();
    return response.data;
  },
  (error) => {
    const store = useStore();
    store.finishProgress();
    if (error.status == 422 || error.status == 401) {
      if (loginErrorMessageShown) return;
      loginErrorMessageShown = true;
      ElMessage.error("登录已过期，请重新登录");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "#/login"; // 直接跳转
      setTimeout(() => {
        loginErrorMessageShown = false;
        console.log(loginErrorMessageShown);
      }, 2000);
      return;
    }
    return Promise.reject(error);
  }
);
