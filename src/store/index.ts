import { defineStore } from "pinia";

interface StoreState {
  user: any | null; //用户信息
  pageProgress: number; //页面加载进度
  loginExpired: boolean; // 登录过期状态
}

export const useStore = defineStore("hz-store", {
  state: (): StoreState => ({
    user: null,
    pageProgress: 0,
    loginExpired: false, // 登录过期状态
  }),

  actions: {
    setUser(info: any) {
      this.user = info;
    },
    getUser() {
      if (this.user) {
        return this.user;
      }
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        this.user = JSON.parse(userInfo);
      } else {
        this.user = null;
      }
      return this.user;
    },
    startProgress() {
      this.pageProgress = 20;
      let timer = setInterval(() => {
        if (this.pageProgress < 80) {
          this.pageProgress += 20;
        } else {
          clearInterval(timer);
        }
      }, 800);
    },
    finishProgress() {
      this.pageProgress = 100;
    },
  },
});
