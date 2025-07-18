import axiosInstance from '../axiosInstance';

/**
 * 관리자 사용자 관리 API - 개선 버전
 * 백엔드: UserAdminController (/api/admin/users)
 */

const ADMIN_USER_API_BASE = '/api/admin/users';

export const adminUserAPI = {
  // === 기본 CRUD 작업 ===
  
  getUserAccounts: async (page = 1, size = 10, role = null, status = null, keyword = null, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', size);
      if (role) params.append('role', role);
      if (status) params.append('status', status);
      if (keyword) params.append('keyword', keyword);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await axiosInstance.get(`${ADMIN_USER_API_BASE}?${params}`);
      return {
        success: true,
        data: response.data,
        message: '사용자 목록을 성공적으로 불러왔습니다.'
      };
    } catch (error) {
      console.error('getUserAccounts 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 목록을 불러오는데 실패했습니다.'
      };
    }
  },

  getUserAccount: async (userId) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_USER_API_BASE}/${userId}`);
      return {
        success: true,
        data: response.data,
        message: '사용자 정보를 성공적으로 불러왔습니다.'
      };
    } catch (error) {
      console.error('getUserAccount 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 정보를 불러오는데 실패했습니다.'
      };
    }
  },

  createUserAccount: async (userData) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_USER_API_BASE}`, userData);
      return {
        success: true,
        data: response.data,
        message: '사용자가 성공적으로 생성되었습니다.'
      };
    } catch (error) {
      console.error('createUserAccount 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 생성에 실패했습니다.'
      };
    }
  },

  updateUserAccount: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`${ADMIN_USER_API_BASE}/${userId}`, userData);
      return {
        success: true,
        data: response.data,
        message: '사용자 정보가 성공적으로 수정되었습니다.'
      };
    } catch (error) {
      console.error('updateUserAccount 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 정보 수정에 실패했습니다.'
      };
    }
  },

  deleteUserAccount: async (userId, reason = '관리자 요청') => {
    try {
      const response = await axiosInstance.delete(
        `${ADMIN_USER_API_BASE}/${userId}?reason=${encodeURIComponent(reason)}`
      );
      return {
        success: true,
        data: response.data,
        message: '사용자가 성공적으로 삭제되었습니다.'
      };
    } catch (error) {
      console.error('deleteUserAccount 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 삭제에 실패했습니다.'
      };
    }
  },

  // === 상태 및 역할 관리 ===

  changeUserStatus: async (userId, status, reason = '') => {
    try {
      const response = await axiosInstance.patch(`${ADMIN_USER_API_BASE}/${userId}/status`, {
        status: status.toUpperCase(),
        reason
      });
      return {
        success: true,
        data: response.data,
        message: '사용자 상태가 성공적으로 변경되었습니다.'
      };
    } catch (error) {
      console.error('changeUserStatus 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 상태 변경에 실패했습니다.'
      };
    }
  },

  changeUserRole: async (userId, role, reason = '') => {
    try {
      const response = await axiosInstance.patch(`${ADMIN_USER_API_BASE}/${userId}/role`, {
        role: role.toUpperCase(),
        reason
      });
      return {
        success: true,
        data: response.data,
        message: '사용자 역할이 성공적으로 변경되었습니다.'
      };
    } catch (error) {
      console.error('changeUserRole 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 역할 변경에 실패했습니다.'
      };
    }
  },

  // === 대량 작업 ===

  changeUsersStatus: async (userIds, status, reason = '') => {
    try {
      const response = await axiosInstance.patch(`${ADMIN_USER_API_BASE}/bulk/status`, {
        userIds,
        status,
        reason
      });
      return {
        success: true,
        data: response.data,
        message: `${userIds.length}명의 사용자 상태가 성공적으로 변경되었습니다.`
      };
    } catch (error) {
      console.error('changeUsersStatus 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 상태 일괄 변경에 실패했습니다.'
      };
    }
  },

  deleteMultipleUsers: async (userIds, reason = '관리자 일괄 삭제') => {
    try {
      const response = await axiosInstance.delete(`${ADMIN_USER_API_BASE}/bulk`, {
        data: { userIds, reason }
      });
      return {
        success: true,
        data: response.data,
        message: `${userIds.length}명의 사용자가 성공적으로 삭제되었습니다.`
      };
    } catch (error) {
      console.error('deleteMultipleUsers 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 일괄 삭제에 실패했습니다.'
      };
    }
  },

  // === 통계 및 분석 ===

  getUserStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_USER_API_BASE}/stats`);
      return {
        success: true,
        data: response.data.data,
        message: '사용자 통계를 성공적으로 불러왔습니다.'
      };
    } catch (error) {
      console.error('getUserStats 에러:', error);
      return {
        success: false,
        data: {
          totalUsers: 0,
          regularUsers: 0,
          studioOwners: 0,
          classOwners: 0,
          admins: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          lockedUsers: 0
        },
        message: error.response?.data?.message || '사용자 통계를 불러오는데 실패했습니다.'
      };
    }
  },

  getUserActivity: async (userId, page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_USER_API_BASE}/${userId}/activity?page=${page}&size=${size}`);
      return {
        success: true,
        data: response.data,
        message: '사용자 활동 기록을 성공적으로 불러왔습니다.'
      };
    } catch (error) {
      console.error('getUserActivity 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 활동 기록을 불러오는데 실패했습니다.'
      };
    }
  },

  getUserLoginHistory: async (userId, page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_USER_API_BASE}/${userId}/login-history?page=${page}&size=${size}`);
      return {
        success: true,
        data: response.data,
        message: '로그인 기록을 성공적으로 불러왔습니다.'
      };
    } catch (error) {
      console.error('getUserLoginHistory 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '로그인 기록을 불러오는데 실패했습니다.'
      };
    }
  },

  // === 검색 및 필터링 ===

  searchUsers: async (searchParams) => {
    try {
      const { keyword, role, status, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc' } = searchParams;
      const params = new URLSearchParams();
      
      if (keyword) params.append('keyword', keyword);
      if (role) params.append('role', role);
      if (status) params.append('status', status);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await axiosInstance.get(`${ADMIN_USER_API_BASE}/search?${params}`);
      return {
        success: true,
        data: response.data,
        message: '검색 결과를 성공적으로 불러왔습니다.'
      };
    } catch (error) {
      console.error('searchUsers 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 검색에 실패했습니다.'
      };
    }
  },

  // === 보안 및 감사 ===

  lockUser: async (userId, reason, duration = null) => {
    try {
      const response = await axiosInstance.patch(`${ADMIN_USER_API_BASE}/${userId}/lock`, {
        reason,
        duration
      });
      return {
        success: true,
        data: response.data,
        message: '사용자가 성공적으로 잠겼습니다.'
      };
    } catch (error) {
      console.error('lockUser 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 잠금에 실패했습니다.'
      };
    }
  },

  unlockUser: async (userId, reason) => {
    try {
      const response = await axiosInstance.patch(`${ADMIN_USER_API_BASE}/${userId}/unlock`, {
        reason
      });
      return {
        success: true,
        data: response.data,
        message: '사용자 잠금이 성공적으로 해제되었습니다.'
      };
    } catch (error) {
      console.error('unlockUser 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 잠금 해제에 실패했습니다.'
      };
    }
  },

  getAuditLog: async (userId, page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_USER_API_BASE}/${userId}/audit?page=${page}&size=${size}`);
      return {
        success: true,
        data: response.data,
        message: '감사 로그를 성공적으로 불러왔습니다.'
      };
    } catch (error) {
      console.error('getAuditLog 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '감사 로그를 불러오는데 실패했습니다.'
      };
    }
  },

  // === 알림 및 메시지 ===

  sendNotification: async (userIds, notificationData) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_USER_API_BASE}/notification`, {
        userIds,
        ...notificationData
      });
      return {
        success: true,
        data: response.data,
        message: '알림이 성공적으로 전송되었습니다.'
      };
    } catch (error) {
      console.error('sendNotification 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '알림 전송에 실패했습니다.'
      };
    }
  },

  // === 내보내기 ===

  exportUsers: async (format = 'excel', filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await axiosInstance.get(`${ADMIN_USER_API_BASE}/export?${params}`, {
        responseType: 'blob'
      });
      
      return {
        success: true,
        data: response.data,
        message: '사용자 데이터를 성공적으로 내보냈습니다.'
      };
    } catch (error) {
      console.error('exportUsers 에러:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || '사용자 데이터 내보내기에 실패했습니다.'
      };
    }
  },

  // === 편의 메서드 ===

  getRegularUsers: async (page = 1, size = 10, status = null, keyword = null) => {
    return await adminUserAPI.getUserAccounts(page, size, 'USER', status, keyword);
  },

  getStudioOwners: async (page = 1, size = 10, status = null, keyword = null) => {
    return await adminUserAPI.getUserAccounts(page, size, 'STUDIO_OWNER', status, keyword);
  },

  getClassOwners: async (page = 1, size = 10, status = null, keyword = null) => {
    return await adminUserAPI.getUserAccounts(page, size, 'CLASS_OWNER', status, keyword);
  },

  getAdmins: async (page = 1, size = 10, status = null, keyword = null) => {
    return await adminUserAPI.getUserAccounts(page, size, 'ADMIN', status, keyword);
  },

  getActiveUsers: async (page = 1, size = 10, role = null, keyword = null) => {
    return await adminUserAPI.getUserAccounts(page, size, role, 'ACTIVE', keyword);
  },

  getInactiveUsers: async (page = 1, size = 10, role = null, keyword = null) => {
    return await adminUserAPI.getUserAccounts(page, size, role, 'INACTIVE', keyword);
  },

  getLockedUsers: async (page = 1, size = 10, role = null, keyword = null) => {
    return await adminUserAPI.getUserAccounts(page, size, role, 'LOCKED', keyword);
  }
};

export default adminUserAPI;