import axiosInstance from './axiosInstance';

// 회원가입
export const register = (userData) =>
  axiosInstance.post('/api/auth/register', userData);

// 이메일 중복 검사
export const validateEmail = (email) =>
  axiosInstance.post('/api/auth/validate/email', { email });

// 전화번호 중복 검사
export const validatePhone = (phone) =>
  axiosInstance.post('/api/auth/validate/phone', { phone });

// 일반 로그인
export const login = (email, password) =>
  axiosInstance.post('/api/auth/login', { email, password });

// 카카오 로그인
export const kakaoLogin = (data) =>
  axiosInstance.post('/api/auth/social/kakao', data);

// 로그아웃
export const logout = () =>
  axiosInstance.post('/api/auth/logout');
