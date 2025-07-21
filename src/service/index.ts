import axios from "axios";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import { removeTokens } from "@/utils/tokenUtils";

export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 1000 * 60,
});

http.interceptors.request.use(
  (config) => {
    const store = useStore();
    store.startProgress();
    const token = localStorage.getItem("accessToken");
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
      if (store.loginExpired) return;
      store.loginExpired = true; // 设置登录过期状态
      ElMessage.error("登录已过期，请重新登录");
      removeTokens(); // 清除本地存储的token
      window.location.href = "#/login"; // 直接跳转
      return;
    }
    return Promise.reject(error);
  }
);
