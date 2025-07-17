import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, AlertCircle, RefreshCw, Search, Download } from 'lucide-react';
import { Table, StatCard, SimpleBarChart, AlertCard } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import reservationAPI from '../../../lib/admin/reservationAPI';
import { formatDate, formatDateTime, getStatusBadgeColor, getStatusText, STATUS_CODES } from '../../../lib/admin';

const BookingMonitoringPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudio, setSelectedStudio] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({});
  const [hourlyData, setHourlyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  // 자동 새로고침 간격 (30초)
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchReservations(currentPage, selectedDate, selectedStudio, searchKeyword);
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, currentPage, selectedDate, selectedStudio, searchKeyword]);

  // 데이터 로드
  const fetchReservations = async (page = 1, date = selectedDate, studio = selectedStudio, keyword = searchKeyword) => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = date;
      const endDate = date;
      const studioParam = studio === 'all' ? null : studio;
      const keywordParam = keyword.trim() || null;
      
      const response = await reservationAPI.getAllReservations(page, 10, null, startDate, endDate, null, studioParam, keywordParam);
      
      if (response.success) {
        setReservations(response.data.reservations || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(page);
      } else {
        throw new Error(response.message || '예약 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('예약 목록 로드 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 통계 데이터 로드
  const fetchStats = async () => {
    try {
      const response = await reservationAPI.getReservationStats();
      if (response.success) {
        setStats(response.data);
        generateHourlyData(response.data);
      }
    } catch (err) {
      console.error('통계 로드 실패:', err);
    }
  };

  // 시간대별 데이터 생성
  const generateHourlyData = (statsData) => {
    if (!statsData.hourlyDistribution) {
      // 기본 시간대 데이터 생성
      const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9시부터 20시까지
      const defaultData = hours.map(hour => ({
        label: `${hour}:00`,
        value: 0,
        percentage: 0
      }));
      setHourlyData(defaultData);
      return;
    }

    const maxValue = Math.max(...statsData.hourlyDistribution.map(item => item.count));
    const hourlyData = statsData.hourlyDistribution.map(item => ({
      label: `${item.hour}:00`,
      value: item.count,
      percentage: maxValue > 0 ? (item.count / maxValue) * 100 : 0
    }));
    
    setHourlyData(hourlyData);
  };

  useEffect(() => {
    fetchReservations();
    fetchStats();
  }, []);

  // 필터 변경 시 데이터 재로드
  useEffect(() => {
    fetchReservations(1, selectedDate, selectedStudio, searchKeyword);
  }, [selectedDate, selectedStudio]);

  // 검색 핸들러
  const handleSearch = () => {
    fetchReservations(1, selectedDate, selectedStudio, searchKeyword);
  };

  // 검색 입력 핸들러
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 수동 새로고침
  const handleRefresh = () => {
    fetchReservations(currentPage, selectedDate, selectedStudio, searchKeyword);
    fetchStats();
  };

  // 예약 상태 변경
  const handleStatusChange = async (reservationId, newStatus) => {
    if (processingIds.has(reservationId)) return;
    
    const reason = prompt(`예약 상태를 ${getStatusText(newStatus)}(으)로 변경하는 사유를 입력하세요:`);
    if (!reason) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(reservationId));
      
      const response = await reservationAPI.changeReservationStatus(reservationId, newStatus, reason);
      
      if (response.success) {
        await fetchReservations(currentPage, selectedDate, selectedStudio, searchKeyword);
        await fetchStats();
      } else {
        throw new Error(response.message || '상태 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('예약 상태 변경 실패:', err);
      alert(err.message);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reservationId);
        return newSet;
      });
    }
  };

  // 예약 상세보기
  const handleViewDetail = (reservationId) => {
    // TODO: 상세 모달 또는 페이지로 이동
    console.log('View reservation detail:', reservationId);
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    fetchReservations(page, selectedDate, selectedStudio, searchKeyword);
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    // TODO: 엑셀 다운로드 구현
    console.log('Excel download');
  };

  // 상태 배지 생성
  const getStatusBadge = (status) => {
    const color = getStatusBadgeColor(status);
    const text = getStatusText(status);
    
    return (
      <Badge 
        variant={color === 'green' ? 'success' : 
               color === 'yellow' ? 'warning' : 
               color === 'blue' ? 'info' :
               color === 'red' ? 'danger' : 'default'}
      >
        {text}
      </Badge>
    );
  };

  // 통계 카드 데이터 생성
  const getBookingStats = () => {
    return [
      {
        title: '오늘 예약',
        value: stats.todayReservations?.toString() || '0',
        change: stats.todayGrowthRate ? `${stats.todayGrowthRate > 0 ? '+' : ''}${stats.todayGrowthRate}%` : null,
        icon: Calendar,
        color: 'blue'
      },
      {
        title: '진행 중',
        value: stats.ongoingReservations?.toString() || '0',
        change: stats.ongoingGrowthRate ? `${stats.ongoingGrowthRate > 0 ? '+' : ''}${stats.ongoingGrowthRate}%` : null,
        icon: Clock,
        color: 'green'
      },
      {
        title: '완료',
        value: stats.completedReservations?.toString() || '0',
        change: stats.completedGrowthRate ? `${stats.completedGrowthRate > 0 ? '+' : ''}${stats.completedGrowthRate}%` : null,
        icon: Users,
        color: 'teal'
      },
      {
        title: '취소/노쇼',
        value: stats.cancelledReservations?.toString() || '0',
        change: stats.cancelledGrowthRate ? `${stats.cancelledGrowthRate > 0 ? '+' : ''}${stats.cancelledGrowthRate}%` : null,
        icon: AlertCircle,
        color: 'red'
      }
    ];
  };

  // 테이블 데이터 생성
  const tableData = reservations.map(reservation => [
    reservation.studioInfo?.name || '알 수 없음',
    reservation.userInfo?.name || '알 수 없음',
    formatDateTime(reservation.reservationDate),
    `${reservation.participantCount || 1}명`,
    getStatusBadge(reservation.status),
    reservation.studioInfo?.location || '알 수 없음'
  ]);

  // 테이블 액션 생성
  const tableActions = reservations.map(reservation => [
    <Button 
      key="detail" 
      variant="outline" 
      size="small"
      onClick={() => handleViewDetail(reservation.id)}
    >
      상세보기
    </Button>,
    
    // 상태 변경 버튼들
    reservation.status === STATUS_CODES.RESERVATION_PENDING && (
      <Button 
        key="confirm" 
        variant="success" 
        size="small"
        onClick={() => handleStatusChange(reservation.id, STATUS_CODES.RESERVATION_CONFIRMED)}
        disabled={processingIds.has(reservation.id)}
      >
        승인
      </Button>
    ),
    
    reservation.status === STATUS_CODES.RESERVATION_CONFIRMED && (
      <Button 
        key="complete" 
        variant="info" 
        size="small"
        onClick={() => handleStatusChange(reservation.id, STATUS_CODES.RESERVATION_COMPLETED)}
        disabled={processingIds.has(reservation.id)}
      >
        완료
      </Button>
    ),
    
    [STATUS_CODES.RESERVATION_PENDING, STATUS_CODES.RESERVATION_CONFIRMED].includes(reservation.status) && (
      <Button 
        key="cancel" 
        variant="danger" 
        size="small"
        onClick={() => handleStatusChange(reservation.id, STATUS_CODES.RESERVATION_CANCELLED)}
        disabled={processingIds.has(reservation.id)}
      >
        취소
      </Button>
    )
  ].filter(Boolean));

  const bookingStats = getBookingStats();

  return (
    <div className="space-y-6">
      {/* 필터 및 날짜 선택 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select 
            value={selectedStudio}
            onChange={(e) => setSelectedStudio(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">전체 스튜디오</option>
            <option value="photo">포토 스튜디오</option>
            <option value="music">음악 스튜디오</option>
            <option value="dance">댄스 스튜디오</option>
          </select>
          <Input 
            placeholder="예약자명 검색..." 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-48" 
          />
          <Button onClick={handleSearch} variant="outline" size="small">
            <Search className="w-4 h-4 mr-1" />
            검색
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span>자동 새로고침</span>
          </label>
          <Button onClick={handleExcelDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            엑셀 다운로드
          </Button>
          <Button onClick={handleRefresh} variant="primary">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>

      {/* 에러 표시 */}
      {error && (
        <AlertCard
          type="error"
          title="데이터 로드 오류"
          message={error}
          action="다시 시도"
          onAction={handleRefresh}
        />
      )}

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bookingStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            loading={loading && !stat.value}
          />
        ))}
      </div>

      {/* 시간대별 예약 현황 */}
      <SimpleBarChart 
        data={hourlyData} 
        title="시간대별 예약 현황"
        loading={loading && hourlyData.length === 0}
      />

      {/* 실시간 예약 현황 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">실시간 예약 현황</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {autoRefresh ? '실시간 업데이트' : '수동 업데이트'}
              </span>
            </div>
          </div>
        </div>
        <Table
          headers={['스튜디오명', '예약자', '시간', '인원', '상태', '위치']}
          data={tableData}
          actions={tableActions}
          loading={loading}
          emptyMessage={searchKeyword ? '검색 결과가 없습니다.' : '예약이 없습니다.'}
          emptyIcon={Calendar}
        />
      </div>

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            variant="outline"
            size="small"
          >
            이전
          </Button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={currentPage === page ? "primary" : "outline"}
                size="small"
              >
                {page}
              </Button>
            );
          })}
          
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            variant="outline"
            size="small"
          >
            다음
          </Button>
        </div>
      )}

      {/* 최근 알림 (실제 데이터가 있다면 표시) */}
      {stats.recentAlerts && stats.recentAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
              주의사항 및 알림
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats.recentAlerts.map((alert, index) => (
                <AlertCard
                  key={index}
                  type={alert.type || 'info'}
                  title={alert.title}
                  message={alert.message}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingMonitoringPage;
