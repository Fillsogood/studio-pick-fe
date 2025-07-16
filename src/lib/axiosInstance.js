import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 서버 URL
  timeout: 5000,
  withCredentials: true, // 쿠키 사용 시 true
});

export default axiosInstance;
