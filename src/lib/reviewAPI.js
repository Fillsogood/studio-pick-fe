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

// 내가 작성한 리뷰 조회
export const getMyeReviews = (params) =>
    axiosInstance.get('/api/users/reviews', { params });

// 특정 스튜디오 리뷰 조회
export const getStudioReviews = (studioId, params) =>
  axiosInstance.get(`/api/studios/${studioId}/reviews`, { params });

// 스튜디오 리뷰 생성
export const createStudioReview = (data) =>
    axiosInstance.put(`/api/studios/reviews`, data);


// 스튜디오 리뷰 수정
export const updateeStudioReview = (id, data) =>
  axiosInstance.put(`/api/studios/reviews/${id}`, data);

// 스튜디오 리뷰 삭제
export const deleteeStudioReview = (id) =>
  axiosInstance.delete(`/api/studios/reviews/${id}`);

// 클레스 리뷰 생성
export const createClassReview = (data) => {
    return axiosInstance.post('/api/classes/reviews', data);
};

// 클레스 리뷰 수정
export const updateClassReview = (id, data) => {
    return axiosInstance.patch(`/api/classes/reviews/${id}`, data);
};

// 클레스 리뷰 삭제
export const deleteClassReview = (id) => {
    return axiosInstance.delete(`/api/classes/reviews/${id}`);
};

// 클레스 리뷰 탐색
export const getClassReviews = (classId) => {
    return axiosInstance.get(`/api/classes/${classId}/reviews`);
};

// 클레스 운영자 리뷰 셍성
export const createClassReviewReply = (reviewId, data) => {
    return axiosInstance.post(`/api/classes/reviews/${reviewId}/reply`, data);
};

// 클레스 운영자 리뷰 수정
export const updateClassReviewReply = (replyId, data) => {
    return axiosInstance.patch(`/api/classes/reviews/replies/${replyId}`, data);
};

// 클레스 운영자 리뷰 삭제
export const deleteClassReviewReply = (replyId) => {
    return axiosInstance.delete(`/api/classes/reviews/replies/${replyId}`);
};