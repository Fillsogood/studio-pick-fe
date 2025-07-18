import axiosInstance from '../axiosInstance';

const ADMIN_REFUND_API_BASE = '/api/admin/refunds';

const adminRefundAPI = {
  getRefunds: async (page = 1, size = 20, status = null, startDate = null, endDate = null) => {
    try {
      const params = { page, size };
      if (status) params.status = status;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosInstance.get(`${ADMIN_REFUND_API_BASE}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRefundDetail: async (refundId) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_REFUND_API_BASE}/${refundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  processRefund: async (refundId, command) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_REFUND_API_BASE}/${refundId}/process`, command);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRefundStats: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_REFUND_API_BASE}/stats`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPendingRefundCount: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_REFUND_API_BASE}/pending/count`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  processBulkRefunds: async (command) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_REFUND_API_BASE}/bulk-process`, command);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelRefund: async (refundId, reason) => {
    try {
      const response = await axiosInstance.delete(`${ADMIN_REFUND_API_BASE}/${refundId}/cancel`, {
        params: { reason },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default adminRefundAPI;
