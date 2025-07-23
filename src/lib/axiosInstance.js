import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://api.studiopick.p-e.kr", // 예: http://localhost:8080
  timeout: 5000,
  withCredentials: true, // 쿠키 사용 시 true
});

export default axiosInstance;
