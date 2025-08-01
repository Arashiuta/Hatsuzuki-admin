/**token控制工具 */
const setTokens = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("expiresIn", String(Date.now() + expiresIn * 1000));
};

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiresIn");
  localStorage.removeItem("user");
};

export { setTokens, removeTokens, getAccessToken, getRefreshToken };
