import axiosInstance from '../axiosInstance';

/**
 * 관리자 대시보드 API
 * 백엔드: DashboardAdminController (/api/admin)
 */

const ADMIN_DASHBOARD_API_BASE = '/api/admin';

export const adminDashboardAPI = {
  /**
   * 사용자 통계 조회
   * GET /api/admin/users/stats
   */
  getUserStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_DASHBOARD_API_BASE}/users/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 스튜디오 통계 조회
   * GET /api/admin/studios/stats
   */
  getStudioStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_DASHBOARD_API_BASE}/studios/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 예약 통계 조회
   * GET /api/admin/reservations/stats
   */
  getReservationStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_DASHBOARD_API_BASE}/reservations/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 매출 통계 조회
   * GET /api/admin/sales/stats
   */
  getSalesStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_DASHBOARD_API_BASE}/sales/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 매출 대시보드 통합 조회
   * GET /api/admin/sales/dashboard
   */
  getSalesDashboard: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_DASHBOARD_API_BASE}/sales/dashboard`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 오늘 예약 목록 조회
   * GET /api/admin/reservations/today?page=&size=
   */
  getTodayReservations: async (page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_DASHBOARD_API_BASE}/reservations/today?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 이번 주 예약 목록 조회
   * GET /api/admin/reservations/this-week?page=&size=
   */
  getThisWeekReservations: async (page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_DASHBOARD_API_BASE}/reservations/this-week?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 매출 트렌드 조회
   * GET /api/admin/sales/trend?startDate=&endDate=&period=
   */
  getSalesTrend: async (startDate, endDate, period = 'daily') => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_DASHBOARD_API_BASE}/sales/trend?startDate=${startDate}&endDate=${endDate}&period=${period}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 이번 달 매출 조회
   * GET /api/admin/sales/this-month
   */
  getThisMonthSales: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_DASHBOARD_API_BASE}/sales/this-month`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 대시보드 통합 데이터 조회
   * 여러 통계 데이터를 병렬로 호출 후 통합 반환
   */
  getDashboardData: async () => {
    try {
      const [
        userStats,
        studioStats,
        reservationStats,
        salesStats,
        todayReservations,
        salesTrend
      ] = await Promise.all([
        adminDashboardAPI.getUserStats(),
        adminDashboardAPI.getStudioStats(),
        adminDashboardAPI.getReservationStats(),
        adminDashboardAPI.getSalesStats(),
        adminDashboardAPI.getTodayReservations(1, 5),
        adminDashboardAPI.getThisMonthSales()
      ]);

      return {
        userStats: userStats.data,
        studioStats: studioStats.data,
        reservationStats: reservationStats.data,
        salesStats: salesStats.data,
        todayReservations: todayReservations.data,
        salesTrend: salesTrend.data
      };
    } catch (error) {
      throw error;
    }
  }
};

export default adminDashboardAPI;
