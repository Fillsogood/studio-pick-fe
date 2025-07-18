import axiosInstance from '../axiosInstance';

const ADMIN_REPORT_API_BASE = '/api/admin/reports';

export const adminReportAPI = {
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

      const response = await axiosInstance.get(`${ADMIN_REPORT_API_BASE}?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReportDetail: async (reportId) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_REPORT_API_BASE}/${reportId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  processReport: async (reportId, adminId, command) => {
    try {
      const response = await axiosInstance.post(
        `${ADMIN_REPORT_API_BASE}/${reportId}/process`,
        command,
        { params: { adminId } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  processBatchReports: async (adminId, reportIds, command) => {
    try {
      const response = await axiosInstance.post(
        `${ADMIN_REPORT_API_BASE}/process-batch`,
        command,
        { params: { reportIds: reportIds.join(','), adminId } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReportStats: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_REPORT_API_BASE}/stats`,
        { params: { startDate, endDate } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getContentReports: async (type, contentId) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_REPORT_API_BASE}/content`, {
        params: { type, contentId }
      });
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
      const response = await axiosInstance.get(`${ADMIN_REPORT_API_BASE}/pending-count`);
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

  getPendingReports: async (page = 0, size = 20) => {
    return await adminReportAPI.getReportList(null, 'PENDING', null, null, null, null, null, page, size);
  },

  getProcessedReports: async (page = 0, size = 20) => {
    return await adminReportAPI.getReportList(null, 'PROCESSED', null, null, null, null, null, page, size);
  },

  getRejectedReports: async (page = 0, size = 20) => {
    return await adminReportAPI.getReportList(null, 'REJECTED', null, null, null, null, null, page, size);
  },

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

  approveReport: async (reportId, adminId, reason = '신고 승인') => {
    const command = { action: 'APPROVE', reason, hideContent: true };
    return await adminReportAPI.processReport(reportId, adminId, command);
  },

  rejectReport: async (reportId, adminId, reason = '신고 거부') => {
    const command = { action: 'REJECT', reason, hideContent: false };
    return await adminReportAPI.processReport(reportId, adminId, command);
  },

  approveReports: async (reportIds, adminId, reason = '신고 일괄 승인') => {
    const command = { action: 'APPROVE', reason, hideContent: true };
    return await adminReportAPI.processBatchReports(adminId, reportIds, command);
  },

  rejectReports: async (reportIds, adminId, reason = '신고 일괄 거부') => {
    const command = { action: 'REJECT', reason, hideContent: false };
    return await adminReportAPI.processBatchReports(adminId, reportIds, command);
  },

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
