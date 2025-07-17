import axiosInstance from '../axiosInstance';
/**
 * 관리자 인증 API
 * 백엔드: AuthController (/api/auth)
 * 일반 사용자와 같은 인증 엔드포인트를 사용하되, 역할(ROLE_ADMIN)로 구분
 */

const ADMIN_AUTH_API_BASE = '/auth';

export const adminAuthAPI = {
  /**
   * 관리자 로그인
   * POST /api/auth/login
   */
  login: async (credentials) => {
    const response = await axiosInstance.post(`${ADMIN_AUTH_API_BASE}/login`, credentials);
    return response.data;
  },

  /**
   * 관리자 로그아웃
   * POST /api/auth/logout
   */
  logout: async () => {
    const response = await axiosInstance.post(`${ADMIN_AUTH_API_BASE}/logout`);
    return response.data;
  },

  /**
   * 토큰 새로고침
   * POST /api/auth/refresh
   */
  refreshToken: async () => {
    const response = await axiosInstance.post(`${ADMIN_AUTH_API_BASE}/refresh`);
    return response.data;
  },

  /**
   * 관리자 권한 확인 (토큰 검증)
   * 실제로는 JWT 토큰에서 역할을 확인하는 방식
   */
  verifyAdminAuth: async () => {
    try {
      const response = await axiosInstance.get('/users/me'); // 쿠키 기반 요청
      const role = response.data.role;
      console.log('role:', role);
      if (role !== 'ADMIN') {
        throw new Error('관리자 권한이 없습니다');
      }
  
      return { success: true, isAdmin: true };
    } catch (error) {
      console.error('권한 확인 실패:', error);
      throw error;
    }
  }
};

export default adminAuthAPI;
