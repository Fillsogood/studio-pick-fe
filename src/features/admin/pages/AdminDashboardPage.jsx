import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { StatCard, SimpleBarChart, SimplePieChart, Table } from '../components/common/DataComponents';
import { Button } from '../components/common';
import userAPI from '../../../lib/admin/adminUserAPI';
import studioAPI from '../../../lib/admin/adminStudioAPI';
import reservationAPI from '../../../lib/admin/adminReservationAPI';
import { formatCurrency, formatDateTime, getStatusBadgeColor, getStatusText } from '../../../lib/admin';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    userStats: null,
    studioStats: null,
    reservationStats: null,
    todayReservations: null
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [userStats, studioStats, reservationStats, todayReservations] = await Promise.all([
        userAPI.getUserStats(),
        studioAPI.getStudioStats(),
        reservationAPI.getReservationStats(),
        reservationAPI.getTodayReservations(1, 5)
      ]);

      setDashboardData({
        userStats: userStats.success ? userStats.data : null,
        studioStats: studioStats.success ? studioStats.data : null,
        reservationStats: reservationStats.success ? reservationStats.data : null,
        todayReservations: todayReservations.success ? todayReservations.data : null
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

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // 에러 상태
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

  // 통계 카드 데이터 생성
  const generateStatsCards = () => {
    const cards = [];
    
    if (dashboardData.userStats) {
      const total = dashboardData.userStats.totalUsers || 0;
      const admins = dashboardData.userStats.admins || 0;
      const lockedusers = dashboardData.userStats.lockedUsers || 0;
    
      const nonAdminActiveUsers = total - admins - lockedusers;
    
      cards.push({
        title: '총 사용자',
        value: nonAdminActiveUsers.toLocaleString(),
        change: dashboardData.userStats.userGrowthRate
          ? `+${dashboardData.userStats.userGrowthRate}%`
          : null,
        icon: Users,
        color: 'blue'
      });
    }
    
    if (dashboardData.studioStats) {
      cards.push({
        title: '등록된 스튜디오',
        value: dashboardData.studioStats.totalStudios?.toLocaleString() || '0',
        change: dashboardData.studioStats.studioGrowthRate ? `+${dashboardData.studioStats.studioGrowthRate}%` : null,
        icon: Building,
        color: 'green'
      });
    }
    
    if (dashboardData.reservationStats) {
      cards.push({
        title: '이번 달 예약',
        value: dashboardData.reservationStats.thisMonthReservations?.toLocaleString() || '0',
        change: dashboardData.reservationStats.reservationGrowthRate ? `+${dashboardData.reservationStats.reservationGrowthRate}%` : null,
        icon: Calendar,
        color: 'purple'
      });
    }
    
    if (dashboardData.reservationStats) {
      cards.push({
        title: '이번 달 매출',
        value: formatCurrency(dashboardData.reservationStats.thisMonthRevenue || 0),
        change: dashboardData.reservationStats.revenueGrowthRate ? `+${dashboardData.reservationStats.revenueGrowthRate}%` : null,
        icon: DollarSign,
        color: 'teal'
      });
    }
    
    return cards;
  };

  // 월별 데이터 생성 (샘플 데이터)
  const generateMonthlyData = () => {
    if (dashboardData.reservationStats?.monthlyData) {
      return dashboardData.reservationStats.monthlyData.map((item, index) => ({
        label: item.month || `${index + 1}월`,
        value: item.count || 0,
        percentage: Math.min((item.count || 0) / 200 * 100, 100)
      }));
    }
    
    // 기본 샘플 데이터
    return [
      { label: '1월', value: 150, percentage: 75 },
      { label: '2월', value: 120, percentage: 60 },
      { label: '3월', value: 180, percentage: 90 },
      { label: '4월', value: 200, percentage: 100 },
      { label: '5월', value: 165, percentage: 82 }
    ];
  };

  // 카테고리별 데이터 생성
  const generateCategoryData = () => {
    if (dashboardData.studioStats?.categoryDistribution) {
      return dashboardData.studioStats.categoryDistribution.map(item => ({
        label: item.category || '기타',
        value: item.count || 0
      }));
    }
    
    // 기본 샘플 데이터
    return [
      { label: '사진 스튜디오', value: 45 },
      { label: '음악 스튜디오', value: 25 },
      { label: '댄스 스튜디오', value: 20 },
      { label: '기타', value: 10 }
    ];
  };

  // 최근 예약 데이터 생성
  const generateRecentBookings = () => {
    if (!dashboardData.todayReservations?.reservations) return [];
    
    return dashboardData.todayReservations.reservations.map(reservation => [
      reservation.userInfo?.name || '알 수 없음',
      reservation.studioInfo?.name || '알 수 없음',
      formatDateTime(reservation.reservationDate),
      formatCurrency(reservation.totalAmount || 0),
      <span 
        key={reservation.id}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusBadgeColor(reservation.status)}-100 text-${getStatusBadgeColor(reservation.status)}-800`}
      >
        {getStatusText(reservation.status)}
      </span>
    ]);
  };

  const statsCards = generateStatsCards();
  const monthlyData = generateMonthlyData();
  const categoryData = generateCategoryData();
  const recentBookings = generateRecentBookings();

  return (
    <div className="space-y-6">
      {/* 새로고침 버튼 */}
      <div className="flex justify-end">
        <Button onClick={handleRefresh} variant="outline" size="small">
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart 
          data={monthlyData} 
          title="월별 예약 현황" 
        />
        <SimplePieChart 
          data={categoryData} 
          title="스튜디오 카테고리별 분포" 
        />
      </div>

      {/* 최근 예약 */}
      {recentBookings.length > 0 && (
        <Table
          headers={['사용자', '스튜디오', '예약 시간', '결제 금액', '상태']}
          data={recentBookings}
          actions={[
            <Button key="view" variant="outline" size="small">상세보기</Button>
          ]}
        />
      )}

      {/* 빈 상태 */}
      {recentBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">오늘 예약이 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">새로운 예약을 기다리고 있습니다.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
