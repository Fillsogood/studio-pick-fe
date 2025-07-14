// 스튜디오 목록 조회 (필터, 페이지네이션)
export const getStudios = (params) =>
  axiosInstance.get('/api/studios', { params });

// 스튜디오 검색
export const searchStudios = (params) =>
  axiosInstance.get('/api/studios/search', { params });

// 스튜디오 상세 조회
export const getStudioDetail = (id) =>
  axiosInstance.get(`/api/studios/${id}`);

// 스튜디오 갤러리
export const getStudioGallery = (id) =>
  axiosInstance.get(`/api/studios/${id}/gallery`);

// 요금 정보
export const getStudioPricing = (id) =>
  axiosInstance.get(`/api/studios/${id}/pricing`);

// 실시간 이용 가능 스튜디오
export const getAvailableStudios = (params) =>
  axiosInstance.get(`/api/studios/available-now`, { params });
