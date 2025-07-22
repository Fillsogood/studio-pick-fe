import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StudioApprovalPage from './pages/StudioApprovalPage';
import BookingMonitoringPage from './pages/BookingMonitoringPage';
import SettlementManagementPage from './pages/SettlementManagementPage';
import RefundManagementPage from './pages/RefundManagementPage';
import MemberManagementPage from './pages/MemberManagementPage';
import ReportManagementPage from './pages/ReportManagementPage';
import SalesDashboardPage from './pages/SalesDashboardPage';
// import SystemSettingPage from './pages/SystemSettingPage';

const AdminApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname.split('/admin/')[1] || 'dashboard';
    setCurrentPage(path);
  }, [location.pathname]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/admin/${page}`);
  };

  const pageConfig = {
    dashboard: { title: '대시보드', subtitle: '전체 현황을 한눈에 확인하세요.' },
    studio: { title: '스튜디오 승인', subtitle: '새로운 스튜디오 등록 요청을 관리하세요.' },
    monitoring: { title: '예약 모니터링', subtitle: '실시간 예약 현황을 모니터링하세요.' },
    settlement: { title: '정산 관리', subtitle: '결제 내역과 정산을 관리하세요.' },
    refund: { title: '환불 요청 관리', subtitle: '환불 요청을 검토하고 처리하세요.' },
    member: { title: '회원 계정 관리', subtitle: '사용자 계정을 관리하세요.' },
    report: { title: '신고 관리', subtitle: '신고된 콘텐츠를 검토하고 처리하세요.' },
    sales: { title: '매출 대시보드', subtitle: '매출 현황과 트렌드를 분석하세요.' },
    // settings: { title: '시스템 설정', subtitle: '시스템 설정을 관리하세요.' }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      setCurrentPage={handlePageChange}
      title={pageConfig[currentPage]?.title}
      subtitle={pageConfig[currentPage]?.subtitle}
    >
      <Routes>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="studio" element={<StudioApprovalPage />} />
        <Route path="monitoring" element={<BookingMonitoringPage />} />
        <Route path="settlement" element={<SettlementManagementPage />} />
        <Route path="refund" element={<RefundManagementPage />} />
        <Route path="member" element={<MemberManagementPage />} />
        <Route path="report" element={<ReportManagementPage />} />
        <Route path="sales" element={<SalesDashboardPage />} />
        {/* <Route path="settings" element={<SystemSettingPage />} /> */}
        <Route path="" element={<AdminDashboardPage />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
