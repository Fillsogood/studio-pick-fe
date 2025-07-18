import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 예: http://localhost:8080/api
  timeout: 5000,
  withCredentials: true, // 쿠키 사용 시 true
});


export default axiosInstance;
