import axiosInstance from "./axiosInstance";

// 예약 상세 조회 (토큰에서 userId 자동 추출)
export const getReservationDetail = (reservationId) =>
  axiosInstance.get(`/api/reservations/${reservationId}`);

// 예약 취소 (토큰에서 userId 자동 추출)
export const cancelReservation = (reservationId, cancelReason) =>
  axiosInstance.patch(`/api/reservations/${reservationId}/cancel`, {
    cancelReason: cancelReason,
  });

// 내 예약 목록 조회 (토큰에서 userId 자동 추출)
export const getMyReservations = (params) =>
  axiosInstance.get("/api/reservations/my", { params });

// 예약 가능 시간 조회
export const getAvailableTimes = (studioId, date) =>
  axiosInstance.get(
    `/api/reservations/available-times?studioId=${studioId}&date=${date}`
  );

// 클래스 예약 취소
export const cancelClassReservation = (reservationId, userId) =>
  axiosInstance.patch(
    `/api/users/class-reservations/${reservationId}/cancel?userId=${userId}`
  );
