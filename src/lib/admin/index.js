// 관리자 API 모듈 통합 default import
import adminAuthAPI from './adminAuthAPI';
import dashboardAPI from './adminDashboardAPI';
import studioAPI from './adminStudioAPI';
import userAPI from './adminUserAPI';
import reservationAPI from './adminReservationAPI';
import salesAPI from './adminSalesAPI';
import reportAPI from './adminReportAPI';
import refundAPI from './adminRefundAPI';
import systemSettingAPI from './adminSystemSettingAPI';

export default {
  adminAuthAPI,
  dashboardAPI,
  studioAPI,
  userAPI,
  reservationAPI,
  salesAPI,
  reportAPI,
  refundAPI,
  systemSettingAPI
};

// 타입 정의 (필요시 사용)
export const API_ENDPOINTS = {
  ADMIN_AUTH: '/api/auth',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_STUDIOS: '/api/admin/studios',
  ADMIN_RESERVATIONS: '/api/admin/reservations',
  ADMIN_SALES: '/api/admin/sales',
  ADMIN_REPORTS: '/api/admin/reports',
  ADMIN_REFUNDS: '/api/v1/admin/refunds',
  ADMIN_SETTINGS: '/api/admin/settings'
};

// 상태 코드 정의
export const STATUS_CODES = {
  // 사용자 상태
  USER_ACTIVE: 'ACTIVE',
  USER_INACTIVE: 'INACTIVE',
  USER_LOCKED: 'LOCKED',
  
  // 스튜디오 상태
  STUDIO_PENDING: 'PENDING',
  STUDIO_ACTIVE: 'ACTIVE',
  STUDIO_SUSPENDED: 'SUSPENDED',
  STUDIO_REJECTED: 'REJECTED',
  STUDIO_APPROVED: "approved",
  
  // 예약 상태
  RESERVATION_PENDING: 'PENDING',
  RESERVATION_CONFIRMED: 'CONFIRMED',
  RESERVATION_CANCELLED: 'CANCELLED',
  RESERVATION_COMPLETED: 'COMPLETED',
  RESERVATION_REJECTED: 'REJECTED',
  
  // 신고 상태
  REPORT_PENDING: 'PENDING',
  REPORT_PROCESSED: 'PROCESSED',
  REPORT_REJECTED: 'REJECTED',
  
  // 환불 상태
  REFUND_PENDING: 'PENDING',
  REFUND_PROCESSING: 'PROCESSING',
  REFUND_COMPLETED: 'COMPLETED',
  REFUND_FAILED: 'FAILED',
  
  // 결제 상태
  PAYMENT_PAID: 'PAID',
  PAYMENT_CANCELLED: 'CANCELLED',
  PAYMENT_REFUNDED: 'REFUNDED',
  PAYMENT_FAILED: 'FAILED'
};

// 사용자 역할 정의
export const USER_ROLES = {
  USER: 'USER',
  STUDIO_OWNER: 'STUDIO_OWNER',
  ADMIN: 'ADMIN'
};

// 신고 타입 정의
export const REPORT_TYPES = {
  STUDIO: 'STUDIO',
  ARTWORK: 'ARTWORK',
  REVIEW: 'REVIEW',
  USER: 'USER'
};

// 결제 방법 정의
export const PAYMENT_METHODS = {
  CARD: 'CARD',
  TRANSFER: 'TRANSFER',
  SIMPLE_PAY: 'SIMPLE_PAY'
};

// 시스템 설정 카테고리 정의
export const SETTING_CATEGORIES = {
  BUSINESS: 'BUSINESS',
  SYSTEM: 'SYSTEM',
  PAYMENT: 'PAYMENT',
  SECURITY: 'SECURITY',
  NOTIFICATION: 'NOTIFICATION',
  MAINTENANCE: 'MAINTENANCE'
};

// 공통 유틸리티 함수들
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusBadgeColor = (status) => {
  const colorMap = {
    [STATUS_CODES.USER_ACTIVE]: 'green',
    [STATUS_CODES.USER_INACTIVE]: 'gray',
    [STATUS_CODES.USER_LOCKED]: 'red',
    [STATUS_CODES.STUDIO_PENDING]: 'yellow',
    [STATUS_CODES.STUDIO_ACTIVE]: 'green',
    [STATUS_CODES.STUDIO_SUSPENDED]: 'red',
    [STATUS_CODES.STUDIO_REJECTED]: 'red',
    [STATUS_CODES.RESERVATION_PENDING]: 'yellow',
    [STATUS_CODES.RESERVATION_CONFIRMED]: 'green',
    [STATUS_CODES.RESERVATION_CANCELLED]: 'red',
    [STATUS_CODES.RESERVATION_COMPLETED]: 'blue',
    [STATUS_CODES.RESERVATION_REJECTED]: 'red',
    [STATUS_CODES.REPORT_PENDING]: 'yellow',
    [STATUS_CODES.REPORT_PROCESSED]: 'green',
    [STATUS_CODES.REPORT_REJECTED]: 'red',
    [STATUS_CODES.REFUND_PENDING]: 'yellow',
    [STATUS_CODES.REFUND_PROCESSING]: 'blue',
    [STATUS_CODES.REFUND_COMPLETED]: 'green',
    [STATUS_CODES.REFUND_FAILED]: 'red',
    [STATUS_CODES.PAYMENT_PAID]: 'green',
    [STATUS_CODES.PAYMENT_CANCELLED]: 'red',
    [STATUS_CODES.PAYMENT_REFUNDED]: 'orange',
    [STATUS_CODES.PAYMENT_FAILED]: 'red'
  };
  
  return colorMap[status] || 'gray';
};

export const getStatusText = (status) => {
  const textMap = {
    [STATUS_CODES.USER_ACTIVE]: '활성',
    [STATUS_CODES.USER_INACTIVE]: '비활성',
    [STATUS_CODES.USER_LOCKED]: '잠김',
    [STATUS_CODES.STUDIO_PENDING]: '승인대기',
    [STATUS_CODES.STUDIO_ACTIVE]: '활성',
    [STATUS_CODES.STUDIO_SUSPENDED]: '정지',
    [STATUS_CODES.STUDIO_REJECTED]: '거부',
    [STATUS_CODES.RESERVATION_PENDING]: '대기',
    [STATUS_CODES.RESERVATION_CONFIRMED]: '확정',
    [STATUS_CODES.RESERVATION_CANCELLED]: '취소',
    [STATUS_CODES.RESERVATION_COMPLETED]: '완료',
    [STATUS_CODES.RESERVATION_REJECTED]: '거부',
    [STATUS_CODES.REPORT_PENDING]: '대기',
    [STATUS_CODES.REPORT_PROCESSED]: '처리완료',
    [STATUS_CODES.REPORT_REJECTED]: '거부',
    [STATUS_CODES.REFUND_PENDING]: '대기',
    [STATUS_CODES.REFUND_PROCESSING]: '처리중',
    [STATUS_CODES.REFUND_COMPLETED]: '완료',
    [STATUS_CODES.REFUND_FAILED]: '실패',
    [STATUS_CODES.PAYMENT_PAID]: '결제완료',
    [STATUS_CODES.PAYMENT_CANCELLED]: '취소',
    [STATUS_CODES.PAYMENT_REFUNDED]: '환불',
    [STATUS_CODES.PAYMENT_FAILED]: '실패'
  };
  
  return textMap[status] || status;
};
