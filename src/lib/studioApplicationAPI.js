// 운영 신청
export const applyStudio = (formData) =>
  axiosInstance.post("/api/studios", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 신청 상태 조회
export const getStudioApplication = (id) =>
  axiosInstance.get(`/api/studios/${id}/application-status`);
