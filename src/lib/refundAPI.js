import axiosInstance from "./axiosInstance";

// 내 환불 내역 조회
export const getMyRefundHistory = () => axiosInstance.get("/api/v1/refunds/my");

// 예약별 환불 내역 조회
export const getReservationRefundHistory = (reservationId) =>
  axiosInstance.get(`/api/v1/refunds/reservation/${reservationId}`);

// 환불 상세 조회 (아직 미구현, 추후 필요시)
export const getRefundDetail = (refundId) =>
  axiosInstance.get(`/api/v1/refunds/${refundId}`);
