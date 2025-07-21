import { http } from "@/service/index.ts";
import type { LoginParam } from "@/api/login.d";

export const loginApi = {
  login: (data: LoginParam) => {
    return http.get("/mock/user.json");
  },
};
