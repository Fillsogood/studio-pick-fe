import axiosInstance from "./axiosInstance";

// 스튜디오 목록 조회 (필터, 페이지네이션)
// export const getStudios = (params) =>
//   axiosInstance.get("/api/studios", { params });

export const getStudios = (safeParams) => {
  return axiosInstance.get("/api/studios", { params: safeParams });
};

// 스튜디오 검색
export const activeStudios = (params) =>
  axiosInstance.get("/api/studios/search", { params });

// 스튜디오 상세 조회
export const getStudioDetail = (studioId) =>
  axiosInstance.get(`/api/studios/${studioId}`);

// 스튜디오 갤러리
export const getStudioGallery = (studioId) =>
  axiosInstance.get(`/api/studios/${studioId}/gallery`);

// 요금 정보
export const getStudioPricing = (studioId) =>
  axiosInstance.get(`/api/studios/${studioId}/pricing`);

// 실시간 이용 가능 스튜디오
export const getAvailableStudios = (params) =>
  axiosInstance.get(`/api/studios/available-now`, { params });

// 이미지 업로드 API 호출 (FormData를 받음)
export const uploadImages = async (formData) => {
  try {
    const response = await axiosInstance.post("/api/studios/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // FormData를 보내면 자동으로 설정되지만 명시적으로 설정해도 무방
      },
    });
    return response;
  } catch (error) {
    console.error("uploadImages API 오류:", error);
    throw error;
  }
};

// 내 스튜디오 목록 조회
export const getMyStudios = () => axiosInstance.get("/api/studios/my");

// 스튜디오 정보 수정
export const updateStudio = (studioId, data) =>
  axiosInstance.patch(`/api/studios/${studioId}`, data, {
    headers: { "Content-Type": "application/json" },
  });

// 스튜디오 삭제 (비활성화 처리 등)
export const deleteStudio = (studioId) =>
  axiosInstance.delete(`/api/studios/${studioId}/deactivate`);

export const toggleStudioVisibility = (studioId) => {
  return axiosInstance.patch(`/api/studios/${studioId}/toggle-visibility`);
};
