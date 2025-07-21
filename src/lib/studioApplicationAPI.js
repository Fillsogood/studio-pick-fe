import axiosInstance from "./axiosInstance";

// 운영 신청
export const applyStudio = (formData) =>
  axiosInstance.post("/api/studios/rental", formData, {
    headers: { "Content-Type": "application/json" },
  });

// 신청 상태 조회
export const getStudioApplication = (studioId) =>
  axiosInstance.get(`/api/studios/${studioId}/application-status`);
