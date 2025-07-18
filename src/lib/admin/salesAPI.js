import axiosInstance from '../axiosInstance';

/**
 * 관리자 매출 관리 API
 * 백엔드: SalesAdminController (/api/admin/sales)
 */

const ADMIN_SALES_API_BASE = '/admin/sales';

export const adminSalesAPI = {
  getSalesStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSalesTrend: async (startDate, endDate, period = 'daily') => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_SALES_API_BASE}/trend?startDate=${startDate}&endDate=${endDate}&period=${period}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudioSalesAnalysis: async (page = 1, size = 10, startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (size) params.append('size', size);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/studios?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPaymentMethodStats: async (startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/payment-methods?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRefundStats: async (startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/refunds?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSalesDetails: async (page = 1, size = 10, startDate = null, endDate = null, method = null, status = null) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (size) params.append('size', size);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (method) params.append('method', method);
      if (status) params.append('status', status);

      const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/details?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTodaySales: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/today`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getThisMonthSales: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/this-month`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getThisYearSales: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/this-year`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSalesDashboard: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/dashboard`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getWeeklySales: async () => {
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return await adminSalesAPI.getSalesTrend(weekAgo.toISOString().split('T')[0], now.toISOString().split('T')[0], 'daily');
    } catch (error) {
      throw error;
    }
  },

  getMonthlySales: async (year, month) => {
    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      return await adminSalesAPI.getSalesTrend(startDate, endDate, 'daily');
    } catch (error) {
      throw error;
    }
  },

  getYearlySales: async (year) => {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      return await adminSalesAPI.getSalesTrend(startDate, endDate, 'monthly');
    } catch (error) {
      throw error;
    }
  },

  getCardPaymentStats: async (startDate = null, endDate = null) => {
    return await adminSalesAPI.getSalesDetails(1, 100, startDate, endDate, 'CARD', 'PAID');
  },

  getTransferPaymentStats: async (startDate = null, endDate = null) => {
    return await adminSalesAPI.getSalesDetails(1, 100, startDate, endDate, 'TRANSFER', 'PAID');
  },

  getSimplePaymentStats: async (startDate = null, endDate = null) => {
    return await adminSalesAPI.getSalesDetails(1, 100, startDate, endDate, 'SIMPLE_PAY', 'PAID');
  },

  getTopSalesStudios: async (limit = 10, startDate = null, endDate = null) => {
    return await adminSalesAPI.getStudioSalesAnalysis(1, limit, startDate, endDate);
  },

  getSalesGrowthRate: async (currentStart, currentEnd, previousStart, previousEnd) => {
    try {
      const [currentSales, previousSales] = await Promise.all([
        adminSalesAPI.getSalesTrend(currentStart, currentEnd, 'daily'),
        adminSalesAPI.getSalesTrend(previousStart, previousEnd, 'daily')
      ]);

      const currentTotal = currentSales.data.trends.reduce((sum, trend) => sum + trend.amount, 0);
      const previousTotal = previousSales.data.trends.reduce((sum, trend) => sum + trend.amount, 0);

      const growthRate = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

      return {
        current: currentTotal,
        previous: previousTotal,
        growthRate: growthRate.toFixed(2)
      };
    } catch (error) {
      throw error;
    }
  }
};

export default adminSalesAPI;
