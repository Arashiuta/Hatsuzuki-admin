import axios from "axios";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import {
  removeTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
  
} from "@/utils/tokenUtils";

export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 1000 * 60,
});

http.interceptors.request.use(
  (config) => {
    const store = useStore();
    store.startProgress();
    const token = getAccessToken();
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

let refreshing = false; // 用于标记是否正在刷新token
let requests: {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  request: any;
}[] = []; // 用于存储需要重新请求的数组

const flushRequests = (accessToken: string) => {
  requests.forEach(({ resolve, request }) => {
    request.headers.Authorization = `Bearer ${accessToken}`;
    resolve(http(request));
  });
  requests = [];
};

const rejectRequests = (error: any) => {
  requests.forEach(({ reject }) => reject(error));
  requests = [];
};

http.interceptors.response.use(
  (response) => {
    // 响应数据处理
    const store = useStore();
    store.finishProgress();
    return response.data;
  },
  async (error) => {
    const store = useStore();
    // token过期处理
    const originalRequest = error.config;
    const isRefreshTokenRequest = originalRequest?.url?.includes("/refresh-token");

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshTokenRequest
    ) {
      originalRequest._retry = true; // 标记请求已重试
      const refreshToken = getRefreshToken(); // 获取refreshToken
      if (!refreshToken) {
        rejectRequests(error);
        gotoLoginPage(error);
        return Promise.reject(error);
      }
      if (!refreshing) {
        refreshing = true; // 设置正在刷新状态
        try {
          const res: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
            [key: string]: any;
          } = await http.post("/refresh-token", {
            refreshToken,
          });
          if ((res.code == 200 || res.success) && res.data) {
            const { accessToken, refreshToken, expiresIn } = res.data;
            setTokens(accessToken, refreshToken, expiresIn);

            //重新发起当前失败的请求
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            flushRequests(accessToken); // 执行所有存储
            return http(originalRequest); // 重新发送原始请求
          }

          //刷新token失败
          rejectRequests(error);
          gotoLoginPage(error);
          return Promise.reject(error);
        } catch (refreshError) {
          rejectRequests(refreshError);
          gotoLoginPage(refreshError);
          return Promise.reject(refreshError);
        } finally {
          refreshing = false; // 无论成功失败，都重置刷新状态
        }
      } else {
        // 如果正在刷新token，将当前请求添加到请求队列
        return new Promise((resolve, reject) => {
          requests.push({
            resolve,
            reject,
            request: originalRequest,
          });
        });
      }
    }
    store.finishProgress();
    return Promise.reject(error);
  }
);

const gotoLoginPage = (error: any) => {
  const store = useStore();
  if (store.loginExpired) return;
  store.loginExpired = true; // 设置登录过期状态
  ElMessage.error("登录已过期，请重新登录");
  removeTokens(); // 清除本地存储的token
  requests = []; // 清空请求队列
  store.finishProgress();
  window.location.href = "#/login"; // 跳转到登录页面
  return Promise.reject(error);
};
