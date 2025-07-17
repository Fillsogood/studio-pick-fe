import axiosInstance from '../axiosInstance';

/**
 * 관리자 스튜디오 관리 API
 * 백엔드: AdminStudioController
 */

const ADMIN_STUDIO_API_BASE = '/admin/studios';

export const adminStudioAPI = {
  /**
   * 스튜디오 계정 목록 조회
   * GET /api/admin/studios?page=1&size=10&status=active&keyword=스튜디오명
   */
  getStudioAccounts: async (params = {}) => {
    const { page = 1, size = 10, status, keyword } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page);
    if (size) queryParams.append('size', size);
    if (status) queryParams.append('status', status);
    if (keyword) queryParams.append('keyword', keyword);

    const response = await axiosInstance.get(`${ADMIN_STUDIO_API_BASE}?${queryParams}`);
    return response.data;
  },

  /**
   * 스튜디오 계정 상세 조회
   * GET /api/admin/studios/{studioId}
   */
  getStudioAccount: async (studioId) => {
    const response = await axiosInstance.get(`${ADMIN_STUDIO_API_BASE}/${studioId}`);
    return response.data;
  },

  /**
   * 스튜디오 계정 생성
   * POST /api/admin/studios
   */
  createStudioAccount: async (studioData) => {
    const response = await axiosInstance.post(ADMIN_STUDIO_API_BASE, studioData);
    return response.data;
  },

  /**
   * 스튜디오 계정 수정
   * PUT /api/admin/studios/{studioId}
   */
  updateStudioAccount: async (studioId, studioData) => {
    const response = await axiosInstance.put(`${ADMIN_STUDIO_API_BASE}/${studioId}`, studioData);
    return response.data;
  },

  /**
   * 스튜디오 계정 상태 변경 (승인/거부/정지/활성화)
   * PATCH /api/admin/studios/{studioId}/status
   */
  changeStudioStatus: async (studioId, statusData) => {
    const response = await axiosInstance.patch(`${ADMIN_STUDIO_API_BASE}/${studioId}/status`, statusData);
    return response.data;
  },

  /**
   * 스튜디오 계정 삭제 (소프트 삭제)
   * DELETE /api/admin/studios/{studioId}
   */
  deleteStudioAccount: async (studioId, reason = '관리자 요청') => {
    const response = await axiosInstance.delete(`${ADMIN_STUDIO_API_BASE}/${studioId}?reason=${encodeURIComponent(reason)}`);
    return response.data;
  },

  /**
   * 스튜디오 통계 조회
   * GET /api/admin/studios/stats
   */
  getStudioStats: async () => {
    const response = await axiosInstance.get(`${ADMIN_STUDIO_API_BASE}/stats`);
    return response.data;
  }
};

export default adminStudioAPI;
