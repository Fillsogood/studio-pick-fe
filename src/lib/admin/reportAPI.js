import axiosInstance from '../axiosInstance';

/**
 * 관리자 신고 관리 API
 * 백엔드: ReportAdminController (/api/admin/reports)
 */

const ADMIN_REPORT_API_BASE = '/admin/reports';

export const adminReportAPI = {
  /**
   * 신고 목록 조회 (검색/필터 포함)
   * GET /api/admin/reports
   */
  getReportList: async (
    reportedType = null,
    status = null,
    reporterId = null,
    contentOwnerId = null,
    startDate = null,
    endDate = null,
    keyword = null,
    page = 0,
    size = 20,
    sortBy = 'createdAt',
    sortDirection = 'desc'
  ) => {
    try {
      const params = new URLSearchParams();
      if (reportedType) params.append('reportedType', reportedType);
      if (status) params.append('status', status);
      if (reporterId) params.append('reporterId', reporterId);
      if (contentOwnerId) params.append('contentOwnerId', contentOwnerId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (keyword) params.append('keyword', keyword);
      params.append('page', page);
      params.append('size', size);
      params.append('sortBy', sortBy);
      params.append('sortDirection', sortDirection);

      const response = await axiosInstance.get(`/api${ADMIN_REPORT_API_BASE}?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 신고 상세 조회
   */
  getReportDetail: async (reportId) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_REPORT_API_BASE}/${reportId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 신고 처리
   */
  processReport: async (reportId, adminId, command) => {
    try {
      const response = await axiosInstance.put(
        `${ADMIN_REPORT_API_BASE}/${reportId}/process`,
        command,
        {
          headers: { 'X-ADMIN-ID': adminId }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 신고 일괄 처리
   */
  processBatchReports: async (adminId, reportIds, command) => {
    try {
      const response = await axiosInstance.put(
        `${ADMIN_REPORT_API_BASE}/batch/process?reportIds=${reportIds.join(',')}`,
        command,
        {
          headers: { 'X-ADMIN-ID': adminId }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 신고 통계 조회
   */
  getReportStats: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_REPORT_API_BASE}/stats?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 콘텐츠 신고 목록 조회
   */
  getContentReports: async (type, contentId) => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_REPORT_API_BASE}/content/${type}/${contentId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAutoHiddenReports: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_REPORT_API_BASE}/auto-hidden`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPendingReportCount: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_REPORT_API_BASE}/pending/count`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUrgentReports: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_REPORT_API_BASE}/urgent`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 상태별 목록 조회
   */
  getPendingReports: async (page = 0, size = 20) => {
    return await adminReportAPI.getReportList(null, 'PENDING', null, null, null, null, null, page, size);
  },

  getProcessedReports: async (page = 0, size = 20) => {
    return await adminReportAPI.getReportList(null, 'PROCESSED', null, null, null, null, null, page, size);
  },

  getRejectedReports: async (page = 0, size = 20) => {
    return await adminReportAPI.getReportList(null, 'REJECTED', null, null, null, null, null, page, size);
  },

  /**
   * 유형별 목록 조회
   */
  getStudioReports: async (page = 0, size = 20) => {
    return await adminReportAPI.getReportList('STUDIO', null, null, null, null, null, null, page, size);
  },

  getArtworkReports: async (page = 0, size = 20) => {
    return await adminReportAPI.getReportList('ARTWORK', null, null, null, null, null, null, page, size);
  },

  getReviewReports: async (page = 0, size = 20) => {
    return await adminReportAPI.getReportList('REVIEW', null, null, null, null, null, null, page, size);
  },

  getUserReports: async (page = 0, size = 20) => {
    return await adminReportAPI.getReportList('USER', null, null, null, null, null, null, page, size);
  },

  /**
   * 단일 승인/거부
   */
  approveReport: async (reportId, adminId, reason = '신고 승인') => {
    const command = { action: 'APPROVE', reason, hideContent: true };
    return await adminReportAPI.processReport(reportId, adminId, command);
  },

  rejectReport: async (reportId, adminId, reason = '신고 거부') => {
    const command = { action: 'REJECT', reason, hideContent: false };
    return await adminReportAPI.processReport(reportId, adminId, command);
  },

  /**
   * 일괄 승인/거부
   */
  approveReports: async (reportIds, adminId, reason = '신고 일괄 승인') => {
    const command = { action: 'APPROVE', reason, hideContent: true };
    return await adminReportAPI.processBatchReports(adminId, reportIds, command);
  },

  rejectReports: async (reportIds, adminId, reason = '신고 일괄 거부') => {
    const command = { action: 'REJECT', reason, hideContent: false };
    return await adminReportAPI.processBatchReports(adminId, reportIds, command);
  },

  /**
   * 기간별 통계 조회
   */
  getTodayReportStats: async () => {
    const today = new Date().toISOString().split('T')[0];
    return await adminReportAPI.getReportStats(today, today);
  },

  getThisWeekReportStats: async () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return await adminReportAPI.getReportStats(weekAgo.toISOString().split('T')[0], now.toISOString().split('T')[0]);
  },

  getThisMonthReportStats: async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return await adminReportAPI.getReportStats(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );
  }
};

export default adminReportAPI;
