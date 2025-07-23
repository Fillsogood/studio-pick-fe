import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://3.38.82.194:8080", // 예: http://localhost:8080
  timeout: 5000,
  withCredentials: true, // 쿠키 사용 시 true
});

export default axiosInstance;
