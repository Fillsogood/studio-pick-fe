import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 서버 URL
  timeout: 5000,
  withCredentials: true, // 쿠키 사용 시 true
});

// 요청 인터셉터 - 요청마다 토큰 자동 삽입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
