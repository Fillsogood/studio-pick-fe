import axiosInstance from './axiosInstance';

// 클래스 목록 조회
export const getClasses = (params) =>
  axiosInstance.get('/api/classes', { params });

// 클래스 상세 조회
export const getClassDetail = (id) =>
  axiosInstance.get(`/api/classes/${id}`);

// 클래스 예약
export const reserveClass = (id, data) =>
  axiosInstance.post(`/api/classes/${id}/reservations`, data);

// 내 클래스 예약 내역
export const getMyClassReservations = (params) =>
  axiosInstance.get('/api/users/class-reservations', { params });
