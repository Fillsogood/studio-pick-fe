import axiosInstance from '../axiosInstance';

/**
 * 관리자 매출 관리 API
 * 백엔드: AdminSalesController
 */

const ADMIN_SALES_API_BASE = '/admin/sales';

export const adminSalesAPI = {
  /**
   * 전체 매출 통계 조회
   * GET /api/admin/sales/stats
   */
  getSalesStats: async () => {
    const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/stats`);
    return response.data;
  },

  /**
   * 기간별 매출 트렌드 분석
   * GET /api/admin/sales/trend?startDate=2025-01-01&endDate=2025-01-31&period=daily
   */
  getSalesTrend: async (params = {}) => {
    const { startDate, endDate, period = 'daily' } = params;
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    queryParams.append('period', period);

    const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/trend?${queryParams}`);
    return response.data;
  },

  /**
   * 스튜디오별 매출 분석
   * GET /api/admin/sales/studios?page=1&size=10&startDate=2025-01-01&endDate=2025-01-31
   */
  getStudioSalesAnalysis: async (params = {}) => {
    const { page = 1, size = 10, startDate, endDate } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page);
    if (size) queryParams.append('size', size);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/studios?${queryParams}`);
    return response.data;
  },

  /**
   * 결제 방법별 통계
   * GET /api/admin/sales/payment-methods?startDate=2025-01-01&endDate=2025-01-31
   */
  getPaymentMethodStats: async (params = {}) => {
    const { startDate, endDate } = params;
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/payment-methods?${queryParams}`);
    return response.data;
  },

  /**
   * 환불 통계 및 분석
   * GET /api/admin/sales/refunds?startDate=2025-01-01&endDate=2025-01-31
   */
  getRefundStats: async (params = {}) => {
    const { startDate, endDate } = params;
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/refunds?${queryParams}`);
    return response.data;
  },

  /**
   * 매출 상세 내역 조회
   * GET /api/admin/sales/details?page=1&size=10&startDate=2025-01-01&endDate=2025-01-31&method=card&status=paid
   */
  getSalesDetails: async (params = {}) => {
    const { page = 1, size = 10, startDate, endDate, method, status } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page);
    if (size) queryParams.append('size', size);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (method) queryParams.append('method', method);
    if (status) queryParams.append('status', status);

    const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/details?${queryParams}`);
    return response.data;
  },

  /**
   * 오늘 매출 현황 (빠른 접근용)
   * GET /api/admin/sales/today
   */
  getTodaySales: async () => {
    const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/today`);
    return response.data;
  },

  /**
   * 이번 달 매출 현황 (빠른 접근용)
   * GET /api/admin/sales/this-month
   */
  getThisMonthSales: async () => {
    const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/this-month`);
    return response.data;
  },

  /**
   * 이번 년도 월별 매출 트렌드 (빠른 접근용)
   * GET /api/admin/sales/this-year
   */
  getThisYearSales: async () => {
    const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/this-year`);
    return response.data;
  },

  /**
   * 매출 요약 대시보드 (빠른 접근용)
   * GET /api/admin/sales/dashboard
   */
  getSalesDashboard: async () => {
    const response = await axiosInstance.get(`${ADMIN_SALES_API_BASE}/dashboard`);
    return response.data;
  }
};

export default adminSalesAPI;
