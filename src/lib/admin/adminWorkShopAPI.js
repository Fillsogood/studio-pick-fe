import axiosInstance from '../axiosInstance';

const ADMIN_WORKSHOP_API_BASE = '/api/admin/workshops';

const adminWorkshopAPI = {
  getWorkshops: async ({ page = 1, size = 10, status = null, keyword = null }) => {
    try {
      const response = await axiosInstance.get(ADMIN_WORKSHOP_API_BASE, {
        params: { page, size, status, keyword },
        paramsSerializer: params => Object.entries(params)
          .filter(([_, v]) => v !== null && v !== undefined)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join('&')
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

  changeWorkshopStatus: async (workshopId, command) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_WORKSHOP_API_BASE}/${workshopId}/approval`, command);
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

  deleteWorkshop: async (workshopId, reason) => {
    try {
      const response = await axiosInstance.delete(`${ADMIN_WORKSHOP_API_BASE}/${workshopId}`, {
        params: { reason },
        paramsSerializer: params => Object.entries(params)
          .filter(([_, v]) => v !== null && v !== undefined)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join('&')
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

  getPopularWorkshops: async (period, limit) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_WORKSHOP_API_BASE}/popular`, {
        params: { period, limit },
        paramsSerializer: params => Object.entries(params)
          .filter(([_, v]) => v !== null && v !== undefined)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join('&')
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

  getReportedWorkshops: async ({ page = 1, size = 10 }) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_WORKSHOP_API_BASE}/reported`, {
        params: { page, size },
        paramsSerializer: params => Object.entries(params)
          .filter(([_, v]) => v !== null && v !== undefined)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join('&')
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
