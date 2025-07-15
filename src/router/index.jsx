import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import HomePage from '../features/mainhome/HomePage';


const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* 다른 페이지 추가 가능 */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
