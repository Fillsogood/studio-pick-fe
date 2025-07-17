import axiosInstance from '../axiosInstance';

/**
 * 관리자 예약 관리 API
 * 백엔드: BookingAdminController (/api/admin/bookings)
 */

const ADMIN_BOOKING_API_BASE = '/admin/bookings';

export const adminBookingAPI = {
  /**
   * 실시간 예약 조회
   * GET /api/admin/bookings/realtime?date=YYYY-MM-DD&studioType=all
   */
  getRealTimeBookings: async (date, studioType = 'all') => {
    try {
      const response = await axiosInstance.get(
        `${ADMIN_BOOKING_API_BASE}/realtime?date=${date}&studioType=${studioType}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 예약 통계 조회
   * GET /api/admin/bookings/stats?date=YYYY-MM-DD
   */
  getBookingStats: async (date) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_BOOKING_API_BASE}/stats?date=${date}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 시간대별 예약 조회
   * GET /api/admin/bookings/hourly?date=YYYY-MM-DD
   */
  getHourlyBookings: async (date) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_BOOKING_API_BASE}/hourly?date=${date}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 예약 상세 조회
   * GET /api/admin/bookings/{bookingId}
   */
  getBookingDetail: async (bookingId) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_BOOKING_API_BASE}/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 예약 상태 변경
   * PATCH /api/admin/bookings/{bookingId}/status
   */
  updateBookingStatus: async (bookingId, status, note = '') => {
    try {
      const response = await axiosInstance.patch(
        `${ADMIN_BOOKING_API_BASE}/${bookingId}/status`,
        { status, note }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 예약 검색
   * GET /api/admin/bookings/search?search=term&filter=...
   */
  searchBookings: async (searchTerm, filters = {}) => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        ...filters
      });
      const response = await axiosInstance.get(`${ADMIN_BOOKING_API_BASE}/search?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 예약 알림 목록
   * GET /api/admin/bookings/alerts
   */
  getBookingAlerts: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_BOOKING_API_BASE}/alerts`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default adminBookingAPI;
