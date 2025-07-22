// 리뷰 관련 API 함수들
import axiosInstance from "./axiosInstance";

// 리뷰 이미지 업로드 (즉시 S3 업로드)
export const uploadReviewImages = (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  return axiosInstance.post("/api/reviews/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 리뷰 작성 (메인 API) - JSON 사용
export const createReview = (reviewData) => {
  const requestData = {
    type: reviewData.type,
    targetId: reviewData.targetId,
    rating: reviewData.rating,
    comment: reviewData.comment,
    imageUrls: reviewData.imageUrls || [], // S3 URL 리스트
  };
  
  return axiosInstance.post("/api/reviews", requestData);
};

// 리뷰 답글 작성
export const createReviewReply = (data) => {
  // 백엔드 API 스펙에 맞게 content 필드 사용
  const requestData = {
    reviewId: data.reviewId,
    content: data.content,
  };
  return axiosInstance.post("/api/reviews/reply", requestData);
};

// 리뷰 수정
export const updateReview = (reviewId, data) => {
  // 백엔드 API 스펙에 맞게 imageUrl(단수) 사용
  const requestData = {
    rating: data.rating,
    comment: data.comment,
    imageUrl: data.imageUrl || "", // imageUrl로 변경
  };
  return axiosInstance.patch(`/api/reviews/${reviewId}`, requestData);
};

// 리뷰 상세 조회
export const getReviewDetail = (reviewId) => {
  return axiosInstance.get(`/api/reviews/${reviewId}`);
};

// 리뷰 삭제
export const deleteReview = (reviewId) => {
  return axiosInstance.delete(`/api/reviews/${reviewId}`);
};

// 리뷰 답글 삭제
export const deleteReviewReply = (reviewId) => {
  return axiosInstance.delete(`/api/reviews/reply/${reviewId}`);
};

// 워크샵 리뷰 조회
export const getWorkshopReviews = (workshopId, params = {}) => {
  return axiosInstance.get(`/api/reviews/workshop/${workshopId}`, { params });
};

// 스튜디오 리뷰 조회
export const getStudioReviews = (studioId, params = {}) => {
  return axiosInstance.get(`/api/reviews/studio/${studioId}`, { params });
};

// 내가 작성한 리뷰 조회 (기존 함수 유지)
export const getMyReviews = (params) =>
  axiosInstance.get("/api/users/reviews", { params });

// 즐겨찾기 관련 (기존 함수들 유지)
export const getFavorites = (params) =>
  axiosInstance.get("/api/users/favorites", { params });

export const addFavorite = (targetType, targetId) =>
  axiosInstance.post("/api/users/favorites", { targetType, targetId });

export const removeFavorite = (id) =>
  axiosInstance.delete(`/api/users/favorites/${id}`);

// 신고 접수 (기존 함수 유지)
export const report = (data) => axiosInstance.post("/api/reports", data);
