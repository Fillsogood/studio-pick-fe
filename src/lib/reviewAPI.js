// 즐겨찾기 목록
export const getFavorites = (params) =>
  axiosInstance.get('/api/users/favorites', { params });

// 즐겨찾기 추가
export const addFavorite = (targetType, targetId) =>
  axiosInstance.post('/api/users/favorites', { targetType, targetId });

// 즐겨찾기 삭제
export const removeFavorite = (id) =>
  axiosInstance.delete(`/api/users/favorites/${id}`);

// 신고 접수
export const report = (data) =>
  axiosInstance.post('/api/reports', data);

// 리뷰 작성 (FormData)
export const writeReview = (formData) =>
  axiosInstance.post('/api/reviews', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// 특정 스튜디오 리뷰 조회
export const getStudioReviews = (studioId, params) =>
  axiosInstance.get(`/api/studios/${studioId}/reviews`, { params });

// 내가 작성한 리뷰 조회
export const getMyReviews = (params) =>
  axiosInstance.get('/api/users/reviews', { params });

// 리뷰 수정
export const updateReview = (id, data) =>
  axiosInstance.put(`/api/reviews/${id}`, data);

// 리뷰 삭제
export const deleteReview = (id) =>
  axiosInstance.delete(`/api/reviews/${id}`);
