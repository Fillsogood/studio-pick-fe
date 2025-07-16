import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 서버 URL
  timeout: 5000,
  withCredentials: true, // 쿠키 자동 포함
});

export default axiosInstance;
