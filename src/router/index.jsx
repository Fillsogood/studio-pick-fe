import { Routes, Route } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import StudioListPage from '../features/studio/StudioListPage';
import StudioDetailPage from '../features/studio/StudioDetailPage';
// import DashboardPage from '../features/dashboard/DashboardPage';
// 등 필요한 페이지 import

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/studio" element={<StudioListPage />} />
      <Route path="/studio/:id" element={<StudioDetailPage />} />
      {/* 추가 경로 */}
    </Routes>
  );
};

export default AppRoutes;
