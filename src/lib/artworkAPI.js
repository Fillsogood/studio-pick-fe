// 작품 피드
export const getArtworks = (params) =>
  axiosInstance.get("/api/artworks", { params });

// 작품 업로드 (FormData)
export const uploadArtwork = (formData) =>
  axiosInstance.post("/api/artworks", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 작품 상세
export const getArtworkDetail = (id) =>
  axiosInstance.get(`/api/artworks/${id}`);

// 내 작품 관리
export const getMyArtworks = (params) =>
  axiosInstance.get("/api/users/artworks", { params });

// 작품 수정
export const updateArtwork = (id, data) =>
  axiosInstance.put(`/api/artworks/${id}`, data);

// 작품 삭제
export const deleteArtwork = (id) =>
  axiosInstance.delete(`/api/artworks/${id}`);

// 좋아요
export const likeArtwork = (id) =>
  axiosInstance.post(`/api/artworks/${id}/like`);

// 댓글 작성
export const writeComment = (id, comment) =>
  axiosInstance.post(`/api/artworks/${id}/comments`, { comment });

// 해시태그 자동완성
export const autocompleteHashtags = (query) =>
  axiosInstance.get("/api/artworks/hashtags/autocomplete", {
    params: { q: query },
  });
