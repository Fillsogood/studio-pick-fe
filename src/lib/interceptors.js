import axiosInstance from "./axiosInstance";
import { setRecoil } from "recoil-nexus";       
import { authState } from "../recoil/authState"; 

export const setupInterceptors = () => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const ignoredPaths = ["/auth/login", "/auth/refresh", "/auth/signup"];
      const isIgnored = ignoredPaths.some((path) =>
        originalRequest.url.includes(path)
      );

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isIgnored
      ) {
        originalRequest._retry = true;
        try {
          await axiosInstance.post("/auth/refresh");
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // 로그아웃 처리
          localStorage.removeItem("accessToken");
          localStorage.removeItem("nickname");
          localStorage.removeItem("loginType");
          sessionStorage.removeItem("isLoggedIn");
          sessionStorage.removeItem("user");

          // recoil 상태도 초기화
          setRecoil(authState, { isLoggedIn: false, user: null });

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};