import axiosInstance from './axiosInstance';

// 사용자 정보
export const getMyProfile = () =>
  axiosInstance.get('/api/users/profile');

// 사용자 정보 수정
export const updateMyProfile = (data) =>
  axiosInstance.put('/api/users/profile', data);

// 프로필 이미지 업로드 (FormData)
export const uploadProfileImage = (formData) =>
  axiosInstance.post('/api/users/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// 비밀번호 변경
export const updatePassword = (data) =>
  axiosInstance.put('/api/users/password', data);

/**
 * 비밀번호 재설정 링크 이메일 전송
 * @param {string} email
 */
export const sendResetPasswordEmail = (email) => {
  return axiosInstance.post('/api/users/password/reset-request', { email }, { withCredentials: false });
};


/**
 * 비밀번호 재설정 처리
 * @param {string} token
 * @param {string} newPassword
 */
export const resetPasswordByToken = (token, newPassword) => {
  return axiosInstance.post('/api/users/password/reset', {
    token,
    newPassword,
  });
};

// 회원정보 수정전 비밀번호 인증
export const verifyPassword = async (password) =>
  axiosInstance.post("/api/users/verify-password", { password });

export const updateEmail = (email) => {
  return axiosInstance.put("/api/users/email", { email });
};