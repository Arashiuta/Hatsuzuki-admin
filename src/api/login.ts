import { http } from "@/service/index.ts";
import type { LoginParam } from "./types/login.ts";

export const loginApi = {
  login: (data: LoginParam) => {
    return http.get("/mock/user.json");
  },
};
