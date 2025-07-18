import axiosInstance from '../axiosInstance';

const ADMIN_WORKSHOP_API_BASE = '/api/admin/workshops';

const adminWorkshopAPI = {
  /**
   * 워크샵 목록 조회
   * GET /api/admin/workshops
   */
  getWorkshops: async (page = 1, size = null, status = null, keyword = null) => {
    try {
      const response = await axiosInstance.get(ADMIN_WORKSHOP_API_BASE, {
        params: { page, size, status, keyword }
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getWorkshops 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '워크샵 목록을 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * 워크샵 상세 조회
   * GET /api/admin/workshops/{workshopId}
   */
  getWorkshopDetail: async (workshopId) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_WORKSHOP_API_BASE}/${workshopId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getWorkshopDetail 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '워크샵 상세 정보를 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * 워크샵 승인/거부
   * POST /api/admin/workshops/{workshopId}/approval
   */
  approveWorkshop: async (workshopId, command) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_WORKSHOP_API_BASE}/${workshopId}/approval`, command);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('approveWorkshop 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '워크샵 승인/거부 처리에 실패했습니다.'
      };
    }
  },

  /**
   * 워크샵 상태 변경
   * PATCH /api/admin/workshops/{workshopId}/status
   */
  changeWorkshopStatus: async (workshopId, command) => {
    try {
      const response = await axiosInstance.patch(`${ADMIN_WORKSHOP_API_BASE}/${workshopId}/status`, command);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('changeWorkshopStatus 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '워크샵 상태 변경에 실패했습니다.'
      };
    }
  },

  /**
   * 워크샵 삭제
   * DELETE /api/admin/workshops/{workshopId}?reason=...
   */
  deleteWorkshop: async (workshopId, reason) => {
    try {
      const response = await axiosInstance.delete(`${ADMIN_WORKSHOP_API_BASE}/${workshopId}`, {
        params: { reason }
      });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('deleteWorkshop 에러:', error);
      return {
        success: false,
        message: error.response?.data?.message || '워크샵 삭제에 실패했습니다.'
      };
    }
  },

  /**
   * 워크샵 통계 조회
   * GET /api/admin/workshops/stats
   */
  getWorkshopStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_WORKSHOP_API_BASE}/stats`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getWorkshopStats 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '워크샵 통계 조회에 실패했습니다.'
      };
    }
  },

  /**
   * 인기 워크샵 조회
   * GET /api/admin/workshops/popular?period=...&limit=...
   */
  getPopularWorkshops: async (period, limit) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_WORKSHOP_API_BASE}/popular`, {
        params: { period, limit }
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getPopularWorkshops 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '인기 워크샵 조회에 실패했습니다.'
      };
    }
  },

  /**
   * 신고된 워크샵 목록 조회
   * GET /api/admin/workshops/reported?page=...&size=...
   */
  getReportedWorkshops: async (page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_WORKSHOP_API_BASE}/reported`, {
        params: { page, size }
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getReportedWorkshops 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '신고된 워크샵 목록 조회에 실패했습니다.'
      };
    }
  }
};

export default adminWorkshopAPI;
