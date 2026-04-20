import type { LoginParam } from "./types/login.ts";
import { userMockData } from "../../mock/user";

export const loginApi = {
  login: (_data: LoginParam) => {
    return Promise.resolve(userMockData);
  },
};
