import React, { useState, useEffect } from 'react';
import { Users, Building, Calendar, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react';
import { StatCard, Table, SimpleBarChart } from '../components/common/DataComponents';
import { Button } from '../components/common';
import dashboardAPI from '../../../lib/admin/adminDashboardAPI';
import reservationAPI from '../../../lib/admin/adminReservationAPI';
import { formatCurrency, formatDateTime, getStatusBadgeColor, getStatusText } from '../../../lib/admin';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    userStats: null,
    studioStats: null,
    reservationStats: null,
    salesStats: null,
    kpiStats: null,
    todayReservationList: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboard, kpiStats, todayReservations] = await Promise.all([
        dashboardAPI.getDashboardData(),
        dashboardAPI.getKpiSummary(),
        reservationAPI.getTodayReservations(1, 5)
      ]);

      setDashboardData({
        userStats: dashboard.success ? dashboard.data.userStats : null,
        studioStats: dashboard.success ? dashboard.data.studioStats : null,
        reservationStats: dashboard.success ? dashboard.data.reservationStats : null,
        salesStats: dashboard.success ? dashboard.data.salesStats : null,
        kpiStats: kpiStats.success ? kpiStats.data : null,
        todayReservationList: todayReservations.success ? todayReservations.data.reservations || [] : []
      });

    } catch (err) {
      console.error('대시보드 데이터 로드 실패:', err);
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const generateStatsCards = () => {
    const cards = [];

    if (dashboardData.userStats) {
      cards.push({
        title: '총 사용자',
        value: dashboardData.userStats.totalUsers.toLocaleString(),
        change: dashboardData.userStats.growthRate !== undefined ? `${dashboardData.userStats.growthRate}%` : '변동 없음',
        icon: Users,
        color: 'blue'
      });
    }

    if (dashboardData.studioStats) {
      const approvalRate = dashboardData.studioStats.approvalRate;
      cards.push({
        title: '등록된 스튜디오',
        value: dashboardData.studioStats.totalStudios.toLocaleString(),
        change: approvalRate !== undefined && !isNaN(approvalRate) ? `${approvalRate}% 승인율` : '승인율 없음',
        icon: Building,
        color: 'green'
      });
    }

    if (dashboardData.reservationStats) {
      cards.push({
        title: '총 예약',
        value: dashboardData.reservationStats.totalReservations.toLocaleString(),
        change: `완료 ${dashboardData.reservationStats.completedReservations || 0}`,
        icon: Calendar,
        color: 'purple'
      });
      cards.push({
        title: '오늘 예약',
        value: dashboardData.reservationStats.todayReservations.toLocaleString(),
        change: '오늘 접수된 예약 수',
        icon: Calendar,
        color: 'yellow'
      });
    }

    if (dashboardData.salesStats) {
      cards.push({
        title: '총 매출',
        value: formatCurrency(dashboardData.salesStats.totalSales || 0),
        change: `이번 달 ${formatCurrency(dashboardData.salesStats.monthSales || 0)}`,
        icon: DollarSign,
        color: 'teal'
      });
    }

    return cards;
  };

  const generateKpiChartData = () => {
    if (!dashboardData.kpiStats) return [];
    return [
      { label: '시스템 가동률', value: dashboardData.kpiStats.operationalKpi.systemUptime },
      { label: '응답 속도(ms)', value: dashboardData.kpiStats.operationalKpi.averageResponseTime },
      { label: '예약 성공률(%)', value: dashboardData.kpiStats.operationalKpi.bookingSuccessRate },
      { label: '결제 성공률(%)', value: dashboardData.kpiStats.operationalKpi.paymentSuccessRate },
      { label: '유저 유지율(%)', value: dashboardData.kpiStats.growthKpi.userRetentionRate },
      { label: '스튜디오 유지율(%)', value: dashboardData.kpiStats.growthKpi.studioRetentionRate },
    ];
  };

  const generateRecentBookings = () => {
    if (!Array.isArray(dashboardData.todayReservationList) || dashboardData.todayReservationList.length === 0) return [];
    return dashboardData.todayReservationList.map(reservation => [
      reservation.userInfo?.name || '알 수 없음',
      reservation.studioInfo?.name || '알 수 없음',
      formatDateTime(reservation.reservationDate),
      formatCurrency(reservation.totalAmount || 0),
      <span key={reservation.id} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusBadgeColor(reservation.status)}-100 text-${getStatusBadgeColor(reservation.status)}-800`}>
        {getStatusText(reservation.status)}
      </span>
    ]);
  };

  const statsCards = generateStatsCards();
  const kpiChartData = generateKpiChartData();
  const recentBookings = generateRecentBookings();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleRefresh} variant="outline" size="small">
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kpiChartData.length > 0 ? (
          <SimpleBarChart
            data={kpiChartData.map(item => ({ label: item.label, value: item.value, percentage: item.value }))}
            title="KPI 통계"
            color="blue"
          />
        ) : (
          <div className="flex items-center justify-center h-60 border rounded text-gray-500">KPI 데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
