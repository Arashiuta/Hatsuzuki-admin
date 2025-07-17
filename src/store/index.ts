import { defineStore } from "pinia";

interface StoreState {
  user: any | null; //用户信息
  pageProgress: number; //页面加载进度
}

export const useStore = defineStore("store", {
  state: (): StoreState => ({
    user: null,
    pageProgress: 0,
  }),

  actions: {
    setUser(info: any) {
      this.user = info;
    },
    getUser() {
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        this.user = JSON.parse(userInfo);
      } else {
        this.user = null;
      }
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
