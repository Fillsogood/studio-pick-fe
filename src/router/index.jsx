import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import RegisterPage from '../features/auth/RegisterPage';
import HomePage from '../features/mainhome/HomePage';
import AdminLoginPage from "../features/admin/pages/AdminLoginPage";
import AdminApp from "../features/admin/AdminApp";
import StudioListPage from "../features/studio/StudioListPage.jsx";
import StudioDetailPage from "../features/studio/StudioDetailPage.jsx";
import ForgotPasswordPage from '../features/user/ForgotPasswordPage.jsx';

import ProfilePage from "../features/user/ProfilePage";
import NotificationSettingPage from "../features/user/NotificationSettingPage.jsx";
import MyPageLayout from "../layouts/MyPageLayout";
import ReservationListPage from "../pages/ReservationListPage";

import OAuthKakaoCallbackPage from '../features/auth/OAuthKakaoCallbackPage.jsx';
import OAuthKakaoLogoutCallbackPage from '../features/auth/OAuthKakaoLogoutCallbackPage.jsx';

import ResetPasswordPage from '../features/user/ResetPasswordPage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 카카오 로그인 관련 */}
      <Route path="/oauth2/redirect" element={<OAuthKakaoCallbackPage />} />
      <Route path="/kakao/logout/callback" element={<OAuthKakaoLogoutCallbackPage />} />

      {/* 메인 레이아웃 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reservation" element={<ReservationListPage />} />
        <Route path="/reservation/:id" element={<ReservationListPage />} />
        <Route path="/studios" element={<StudioListPage />} />
        <Route path="/studio/:id" element={<StudioDetailPage />} />


        {/* 마이페이지 영역 */}
        <Route path="account" element={<MyPageLayout />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notification" element={<NotificationSettingPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;