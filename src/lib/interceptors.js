import axiosInstance from "./axiosInstance";

export const setupInterceptors = () => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const ignoredPaths = ["/auth/login", "/auth/refresh", "/auth/signup"];
      const isIgnored = ignoredPaths.some(path => originalRequest.url.includes(path));

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
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
