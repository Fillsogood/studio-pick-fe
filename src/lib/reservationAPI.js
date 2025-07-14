// 예약 가능 시간 조회
export const getAvailableTimes = (studioId, date) =>
  axiosInstance.get(`/api/studios/${studioId}/reservations/available-times`, {
    params: { date },
  });

// 예약 생성
export const createReservation = (studioId, data) =>
  axiosInstance.post(`/api/studios/${studioId}/reservations`, data);

// 사용자 예약 내역
export const getUserReservations = (params) =>
  axiosInstance.get('/api/users/reservations', { params });

// 예약 상세 조회
export const getReservationDetail = (id) =>
  axiosInstance.get(`/api/reservations/${id}`);

// 예약 취소
export const cancelReservation = (id, reason) =>
  axiosInstance.put(`/api/reservations/${id}/cancel`, { reason });

// 예약 공유 링크
export const shareReservation = (id, platform) =>
  axiosInstance.post(`/api/reservations/${id}/share`, { platform });
