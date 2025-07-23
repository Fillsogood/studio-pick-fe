// src/lib/hostAPI.js

import axiosInstance from "./axiosInstance";

/**
 * 호스트센터: 내 클래스 리스트 조회
 */
export const fetchHostClasses = () =>
  axiosInstance.get("/api/host/classes");

/**
 * 호스트센터: 클래스 활성화/비활성화 상태 토글
 */
export const toggleHostClassStatus = (id, status) =>
  axiosInstance.put(`/api/host/classes/${id}/status`, { status });

/**
 * 클래스 상세 조회
 */
export const getClassDetail = (id) =>
  axiosInstance.get(`/api/classes/${id}`);

/**
 * 클래스 정보 수정
 */
export const updateClass = (id, data) =>
  axiosInstance.put(`/api/classes/${id}`, data);
