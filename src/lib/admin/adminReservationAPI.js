import axiosInstance from '../axiosInstance';

const ADMIN_RESERVATION_API_BASE = '/api/admin/reservations';

export const adminReservationAPI = {
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
      const response = await axiosInstance.get(ADMIN_RESERVATION_API_BASE, {
        params: { page, size, status, startDate, endDate, userId, studioId, searchKeyword }
      });
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
      const response = await axiosInstance.get(`${ADMIN_RESERVATION_API_BASE}/users/${userId}`, {
        params: { page, size, status }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudioReservations: async (studioId, page = 1, size = 10, status = null) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_RESERVATION_API_BASE}/studios/${studioId}`, {
        params: { page, size, status }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTodayReservations: async (page = 1, size = 10, status = null) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_RESERVATION_API_BASE}/today`, {
        params: { page, size, status }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getThisWeekReservations: async (page = 1, size = 10, status = null) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_RESERVATION_API_BASE}/this-week`, {
        params: { page, size, status }
      });
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
