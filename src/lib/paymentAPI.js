import axiosInstance from "./axiosInstance";

// 결제 요청
export const requestPayment = (data) =>
  axiosInstance.post("/api/payments", data);

// 결제 내역 조회
export const getPaymentHistory = (params) =>
  axiosInstance.get("/api/users/payments", { params });

// 결제 상세
export const getPaymentDetail = (id) =>
  axiosInstance.get(`/api/payments/${id}`);

// 영수증 다운로드
export const downloadReceipt = (id) =>
  axiosInstance.get(`/api/payments/${id}/receipt`, {
    responseType: "blob",
  });

// 환불 신청
export const requestRefund = (id, data) =>
  axiosInstance.post(`/api/payments/${id}/refund`, data);

// 내 환불 내역 조회 (토큰에서 userId 자동 추출)
export const getMyRefundHistory = () => axiosInstance.get("/api/v1/refunds/my");

// 예약별 환불 내역 조회
export const getReservationRefundHistory = (reservationId) =>
  axiosInstance.get(`/api/v1/refunds/reservation/${reservationId}`);

// 환불 내역 상세 조회
export const getRefundDetail = (refundId) =>
  axiosInstance.get(`/api/v1/refunds/${refundId}`);
