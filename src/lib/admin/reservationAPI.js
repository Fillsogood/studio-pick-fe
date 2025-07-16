import axiosInstance from '../axiosInstance';

/**
 * 관리자 예약 관리 API
 * 백엔드: ReservationAdminController (/api/admin/reservations)
 */

const ADMIN_RESERVATION_API_BASE = '/admin/reservations';

export const adminReservationAPI = {
  /**
   * 전체 예약 목록 조회
   */
  getAllReservations: async (
    page = 1,
    size = 10,
    status = null,
    startDate = null,
    endDate = null,
    userId = null,
    studioId = null,
    searchKeyword = null
  ) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (size) params.append('size', size);
      if (status) params.append('status', status);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (userId) params.append('userId', userId);
      if (studioId) params.append('studioId', studioId);
      if (searchKeyword) params.append('searchKeyword', searchKeyword);

      const response = await axiosInstance.get(`${ADMIN_RESERVATION_API_BASE}?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReservationDetail: async (reservationId) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_RESERVATION_API_BASE}/${reservationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changeReservationStatus: async (reservationId, status, reason = '') => {
    try {
      const response = await axiosInstance.patch(`${ADMIN_RESERVATION_API_BASE}/${reservationId}/status`, {
        status,
        reason
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReservationStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_RESERVATION_API_BASE}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserReservations: async (userId, page = 1, size = 10, status = null) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (size) params.append('size', size);
      if (status) params.append('status', status);

      const response = await axiosInstance.get(
        `${ADMIN_RESERVATION_API_BASE}/users/${userId}?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudioReservations: async (studioId, page = 1, size = 10, status = null) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (size) params.append('size', size);
      if (status) params.append('status', status);

      const response = await axiosInstance.get(
        `${ADMIN_RESERVATION_API_BASE}/studios/${studioId}?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTodayReservations: async (page = 1, size = 10, status = null) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (size) params.append('size', size);
      if (status) params.append('status', status);

      const response = await axiosInstance.get(`${ADMIN_RESERVATION_API_BASE}/today?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getThisWeekReservations: async (page = 1, size = 10, status = null) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (size) params.append('size', size);
      if (status) params.append('status', status);

      const response = await axiosInstance.get(`${ADMIN_RESERVATION_API_BASE}/this-week?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  approveReservation: async (reservationId, reason = '관리자 승인') => {
    return await adminReservationAPI.changeReservationStatus(reservationId, 'CONFIRMED', reason);
  },

  rejectReservation: async (reservationId, reason = '관리자 거부') => {
    return await adminReservationAPI.changeReservationStatus(reservationId, 'REJECTED', reason);
  },

  cancelReservation: async (reservationId, reason = '관리자 취소') => {
    return await adminReservationAPI.changeReservationStatus(reservationId, 'CANCELLED', reason);
  },

  completeReservation: async (reservationId, reason = '관리자 완료 처리') => {
    return await adminReservationAPI.changeReservationStatus(reservationId, 'COMPLETED', reason);
  },

  getConfirmedReservations: async (page = 1, size = 10, startDate = null, endDate = null) => {
    return await adminReservationAPI.getAllReservations(page, size, 'CONFIRMED', startDate, endDate);
  },

  getPendingReservations: async (page = 1, size = 10, startDate = null, endDate = null) => {
    return await adminReservationAPI.getAllReservations(page, size, 'PENDING', startDate, endDate);
  },

  getCancelledReservations: async (page = 1, size = 10, startDate = null, endDate = null) => {
    return await adminReservationAPI.getAllReservations(page, size, 'CANCELLED', startDate, endDate);
  },

  getCompletedReservations: async (page = 1, size = 10, startDate = null, endDate = null) => {
    return await adminReservationAPI.getAllReservations(page, size, 'COMPLETED', startDate, endDate);
  },

  changeReservationsStatus: async (reservationIds, status, reason = '') => {
    try {
      const promises = reservationIds.map((id) =>
        adminReservationAPI.changeReservationStatus(id, status, reason)
      );
      return await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  }
};

export default adminReservationAPI;
