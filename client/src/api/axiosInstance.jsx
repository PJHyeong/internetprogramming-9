import axios from "axios";

const axiosInstance = axios.create({
  baseURL:'http://localhost:3000'
});

//accessToken 헤더 설정
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;