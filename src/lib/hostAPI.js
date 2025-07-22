import axiosInstance from "./axiosInstance";

export const fetchHostClasses = () =>
  axiosInstance.get("/api/host/classes");

export const toggleHostClassStatus = (id, status) =>
  axiosInstance.put(`/api/host/classes/${id}/status`, { status });
