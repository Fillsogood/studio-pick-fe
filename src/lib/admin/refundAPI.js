import axiosInstance from '../axiosInstance';

/**
 * 관리자 환불 관리 API
 * 백엔드: RefundAdminController (/api/admin/refunds)
 */

const ADMIN_REFUND_API_BASE = '/admin';

export const adminRefundAPI = {
  /**
   * 환불 실패 목록 조회
   * GET /api/admin/refunds/failed
   */
  getFailedRefunds: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_REFUND_API_BASE}/refunds/failed`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 일자별 환불 통계 조회
   * GET /api/admin/refunds/stats/daily?startDate=&endDate=
   */
  getDailyRefundStats: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_REFUND_API_BASE}/refunds/stats/daily?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 전체 환불 목록 조회
   * GET /api/admin/refunds/all?page=&size=
   */
  getAllRefunds: async (page = 0, size = 20) => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_REFUND_API_BASE}/refunds/all?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 환불 재시도
   * POST /api/admin/refunds/{refundId}/retry
   */
  retryRefund: async (refundId) => {
    try {
      const response = await axiosInstance.post(
        `${ADMIN_REFUND_API_BASE}/refunds/${refundId}/retry`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 매출에서 환불 통계 조회
   * GET /api/admin/sales/refunds?startDate=&endDate=
   */
  getRefundStatsFromSales: async (startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axiosInstance.get(`${ADMIN_REFUND_API_BASE}/sales/refunds?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 오늘 환불 통계
   */
  getTodayRefundStats: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await adminRefundAPI.getDailyRefundStats(today, today);
    } catch (error) {
      throw error;
    }
  },

  /**
   * 이번 주 환불 통계
   */
  getThisWeekRefundStats: async () => {
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startDate = weekAgo.toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];
      return await adminRefundAPI.getDailyRefundStats(startDate, endDate);
    } catch (error) {
      throw error;
    }
  },

  /**
   * 이번 달 환불 통계
   */
  getThisMonthRefundStats: async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const startDate = startOfMonth.toISOString().split('T')[0];
      const endDate = endOfMonth.toISOString().split('T')[0];
      return await adminRefundAPI.getDailyRefundStats(startDate, endDate);
    } catch (error) {
      throw error;
    }
  },

  /**
   * 환불 통계 조회 (from sales)
   */
  getRefundStats: async (startDate = null, endDate = null) => {
    try {
      return await adminRefundAPI.getRefundStatsFromSales(startDate, endDate);
    } catch (error) {
      throw error;
    }
  },

  /**
   * 환불 상태별 목록 조회
   * GET /api/admin/sales/details?status=&page=&size=
   */
  getRefundsByStatus: async (status = 'COMPLETED', page = 1, size = 20) => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_REFUND_API_BASE}/sales/details?page=${page}&size=${size}&status=${status}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 완료된 환불 목록 조회
   */
  getCompletedRefunds: async (page = 0, size = 20) => {
    try {
      return await adminRefundAPI.getRefundsByStatus('REFUNDED', page, size);
    } catch (error) {
      throw error;
    }
  },

  /**
   * 처리중인 환불 목록 조회
   */
  getProcessingRefunds: async (page = 0, size = 20) => {
    try {
      return await adminRefundAPI.getRefundsByStatus('REFUND_PROCESSING', page, size);
    } catch (error) {
      throw error;
    }
  },

  /**
   * 환불 재시도 (배열)
   */
  retryRefunds: async (refundIds) => {
    try {
      const promises = refundIds.map((id) => adminRefundAPI.retryRefund(id));
      return await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  },

  /**
   * 환불 대시보드 통합 데이터 조회
   */
  getRefundDashboard: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [
        todayStats,
        weekStats,
        monthStats,
        failedRefunds,
        refundTrends
      ] = await Promise.all([
        adminRefundAPI.getTodayRefundStats(),
        adminRefundAPI.getThisWeekRefundStats(),
        adminRefundAPI.getThisMonthRefundStats(),
        adminRefundAPI.getFailedRefunds(),
        adminRefundAPI.getRefundStats(monthAgo, today)
      ]);

      return {
        todayStats: todayStats.data,
        weekStats: weekStats.data,
        monthStats: monthStats.data,
        failedRefunds: failedRefunds.data,
        refundTrends: refundTrends.data
      };
    } catch (error) {
      throw error;
    }
  }
};

export default adminRefundAPI;
