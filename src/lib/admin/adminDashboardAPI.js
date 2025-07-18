import axiosInstance from '../axiosInstance';

/**
 * 관리자 대시보드 API
 * 백엔드: AdminDashboardController (/api/admin/dashboard)
 */

const ADMIN_DASHBOARD_API_BASE = '/api/admin/dashboard';

export const adminDashboardAPI = {
  /**
   * 메인 대시보드 조회
   * GET /api/admin/dashboard
   */
  getDashboardData: async () => {
    try {
      const response = await axiosInstance.get(ADMIN_DASHBOARD_API_BASE);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getDashboardData 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '대시보드 데이터를 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * 기간별 통계 조회
   * GET /api/admin/dashboard/stats
   */
  getDashboardStats: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_DASHBOARD_API_BASE}/stats`, {
        params: { startDate, endDate }
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getDashboardStats 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '기간별 통계를 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * 실시간 통계 조회
   * GET /api/admin/dashboard/realtime
   */
  getRealTimeStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_DASHBOARD_API_BASE}/realtime`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getRealTimeStats 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '실시간 통계를 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * KPI 요약 조회
   * GET /api/admin/dashboard/kpi
   */
  getKpiSummary: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_DASHBOARD_API_BASE}/kpi`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getKpiSummary 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'KPI 요약을 불러오는데 실패했습니다.'
      };
    }
  },


  // === 추가 통계 API (다른 컨트롤러에서 가져오는 통계) ===
  
  /**
   * 사용자 통계 조회
   * GET /api/admin/users/stats
   */
  getUserStats: async () => {
    try {
      const response = await axiosInstance.get('/api/admin/users/stats');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getUserStats 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 통계를 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * 스튜디오 통계 조회
   * GET /api/admin/studios/stats
   */
  getStudioStats: async () => {
    try {
      const response = await axiosInstance.get('/api/admin/studios/stats');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getStudioStats 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '스튜디오 통계를 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * 예약 통계 조회
   * GET /api/admin/reservations/stats
   */
  getReservationStats: async () => {
    try {
      const response = await axiosInstance.get('/api/admin/reservations/stats');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getReservationStats 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '예약 통계를 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * 매출 통계 조회
   * GET /api/admin/sales/stats
   */
  getSalesStats: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/api/admin/sales/stats', { params });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('getSalesStats 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '매출 통계를 불러오는데 실패했습니다.'
      };
    }
  }
};

export default adminDashboardAPI;
