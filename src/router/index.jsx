import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import RegisterPage from "../features/auth/RegisterPage";
import HomePage from "../features/mainhome/HomePage";
import ProfilePage from "../features/user/ProfilePage";
import NotificationSettingPage from "../features/user/NotificationSettingPage.jsx";
import MyPageLayout from "../layouts/MyPageLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />

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
