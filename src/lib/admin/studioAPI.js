import axiosInstance from '../axiosInstance';

/**
 * 관리자 스튜디오 관리 API
 * 백엔드: StudioAdminController (/api/admin/studios)
 */

const ADMIN_STUDIO_API_BASE = '/admin/studios';

export const adminStudioAPI = {
  getStudioAccounts: async (page = 1, size = 10, status = null, keyword = null) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (size) params.append('size', size);
      if (status) params.append('status', status);
      if (keyword) params.append('keyword', keyword);

      const response = await axiosInstance.get(`${ADMIN_STUDIO_API_BASE}?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudioAccount: async (studioId) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_STUDIO_API_BASE}/${studioId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createStudioAccount: async (studioData) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_STUDIO_API_BASE}`, studioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateStudioAccount: async (studioId, studioData) => {
    try {
      const response = await axiosInstance.put(`${ADMIN_STUDIO_API_BASE}/${studioId}`, studioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changeStudioStatus: async (studioId, status, reason = '') => {
    try {
      const response = await axiosInstance.patch(`${ADMIN_STUDIO_API_BASE}/${studioId}/status`, {
        status,
        reason
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteStudioAccount: async (studioId, reason = '관리자 요청') => {
    try {
      const response = await axiosInstance.delete(
        `${ADMIN_STUDIO_API_BASE}/${studioId}?reason=${encodeURIComponent(reason)}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudioStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_STUDIO_API_BASE}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPendingStudios: async (page = 1, size = 10) => {
    return await adminStudioAPI.getStudioAccounts(page, size, 'PENDING');
  },

  getActiveStudios: async (page = 1, size = 10) => {
    return await adminStudioAPI.getStudioAccounts(page, size, 'ACTIVE');
  },

  getSuspendedStudios: async (page = 1, size = 10) => {
    return await adminStudioAPI.getStudioAccounts(page, size, 'SUSPENDED');
  },

  approveStudios: async (studioIds, reason = '관리자 승인') => {
    try {
      const promises = studioIds.map((id) => adminStudioAPI.changeStudioStatus(id, 'ACTIVE', reason));
      return await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  },

  rejectStudios: async (studioIds, reason = '관리자 거부') => {
    try {
      const promises = studioIds.map((id) => adminStudioAPI.changeStudioStatus(id, 'REJECTED', reason));
      return await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  }
};

export default adminStudioAPI;
