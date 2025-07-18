import axiosInstance from '../axiosInstance';

const ADMIN_SETTLEMENT_API_BASE = '/api/admin/settlements';

const adminSettlementAPI = {
  getSettlementTargets: async (page = 1, size = 10, status = null, startDate = null, endDate = null) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTLEMENT_API_BASE}`, {
        params: { page, size, status, startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSettlementDetail: async (settlementId) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTLEMENT_API_BASE}/${settlementId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  processSettlement: async (settlementId, command) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_SETTLEMENT_API_BASE}/${settlementId}/process`, command);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  processBulkSettlement: async (command) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_SETTLEMENT_API_BASE}/process-bulk`, command);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSettlementStats: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTLEMENT_API_BASE}/stats`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudioSettlement: async (studioId, page = 1, size = 10, status = null) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTLEMENT_API_BASE}/studio/${studioId}`, {
        params: { page, size, status }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getWorkshopSettlement: async (workshopId, page = 1, size = 10, status = null) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTLEMENT_API_BASE}/workshop/${workshopId}`, {
        params: { page, size, status }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCommissionRates: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTLEMENT_API_BASE}/commission`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCommissionRate: async (command) => {
    try {
      const response = await axiosInstance.put(`${ADMIN_SETTLEMENT_API_BASE}/commission`, command);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generateSettlementReport: async (command) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_SETTLEMENT_API_BASE}/report`, command);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  approveSettlement: async (settlementId, command) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_SETTLEMENT_API_BASE}/${settlementId}/approval`, command);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default adminSettlementAPI;
