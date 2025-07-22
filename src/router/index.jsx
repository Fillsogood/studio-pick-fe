import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import RegisterPage from "../features/auth/RegisterPage";
import HomePage from "../features/mainhome/HomePage";
import AdminLoginPage from "../features/admin/pages/AdminLoginPage";
import AdminApp from "../features/admin/AdminApp";
import StudioListPage from "../features/studio/StudioListPage.jsx";
import StudioDetailPage from "../features/studio/StudioDetailPage.jsx";
import ForgotPasswordPage from "../features/user/ForgotPasswordPage.jsx";
import StudioApplyPage from "../features/studio/StudioApplyPage.jsx";
import MyStudioManagePage from "../features/studio/MyStudioManagePage.jsx";
import StudioSetupPage from "../features/studio/StudioSetupPage.jsx";
import ClassApplyPage from "../features/workshop/ClassRegisterPage.jsx";
import ClassDetailPage from "../features/workshop/ClassDetailPage";
import HostCenterPage from "../features/host/HostCenterPage.jsx";
import StudioSearchPage from "../features/studio/StudioSearchPage.jsx";

import ProfilePage from "../features/user/ProfilePage";
import NotificationSettingPage from "../features/user/NotificationSettingPage.jsx";
import MyPageLayout from "../layouts/MyPageLayout";
import ReservationListPage from "../features/reservation/ReservationListPage";
import ReviewWritePage from "../features/review/ReviewWritePage";
import ReviewEditPage from "../features/review/ReviewEditPage";
import ClassManagePage from "../features/host/ClassManagePage.jsx";
import OAuthKakaoCallbackPage from "../features/auth/OAuthKakaoCallbackPage.jsx";
import OAuthKakaoLogoutCallbackPage from "../features/auth/OAuthKakaoLogoutCallbackPage.jsx";
import ClassListPage from "../features/workshop/ClassListPage";

import ResetPasswordPage from "../features/user/ResetPasswordPage.jsx";

// 결제 관련 페이지
import PaymentSuccessPage from "../features/payment/PaymentSuccessPage";
import PaymentFailPage from "../features/payment/PaymentFailPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 카카오 로그인 관련 */}
      <Route path="/oauth2/redirect" element={<OAuthKakaoCallbackPage />} />
      <Route
        path="/kakao/logout/callback"
        element={<OAuthKakaoLogoutCallbackPage />}
      />

      {/* 결제 관련 페이지 */}
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/fail" element={<PaymentFailPage />} />

      {/* 메인 레이아웃 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reservation" element={<ReservationListPage />} />
        <Route path="/host" element={<HostCenterPage />} />
        <Route path="/host/classes" element={<ClassManagePage />} />
        <Route
          path="/review/write/:reservationId"
          element={<ReviewWritePage />}
        />
        <Route path="/review/edit/:reviewId" element={<ReviewEditPage />} />
        <Route path="/studios" element={<StudioListPage />} />
        <Route path="/studios/:studioId" element={<StudioDetailPage />} />
        <Route path="/studios/rental" element={<StudioApplyPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/classes/apply" element={<ClassApplyPage />} />
        <Route path="/classes" element={<ClassListPage />} />
        <Route path="/classes/:id" element={<ClassDetailPage />} />
        <Route path="/studios/search" element={<StudioSearchPage />} />
        {/* 다른 페이지 추가 가능 */}

        {/* 마이페이지 영역 */}
        <Route path="account" element={<MyPageLayout />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notification" element={<NotificationSettingPage />} />
          <Route path="studios" element={<MyStudioManagePage />} />
          <Route path="studios/:studioId/setup" element={<StudioSetupPage />} />
        </Route>
      </Route>
      {/* 어드민 전용 라우트 */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
};

export default AppRoutes;
