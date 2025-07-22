import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, AlertCircle, RefreshCw, Search, Download } from 'lucide-react';
import { Table, StatCard } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import reservationAPI from '../../../lib/admin/adminReservationAPI';
import { formatDateTime, getStatusBadgeColor, getStatusText } from '../../../lib/admin';

const BookingMonitoringPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchReservations = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationAPI.getAllReservations(
        page,
        10,
        null,
        null,
        null,
        null,
        null,
        searchKeyword || null
      );
      if (response.success) {
        console.log('Fetched reservations:', reservations);
        setReservations(response.data.reservations || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStats = async () => {
    try {
      const response = await reservationAPI.getReservationStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchStats();
  }, [selectedDate]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => fetchReservations(currentPage), 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, currentPage]);

  const statsCards = [
    { title: '오늘 예약', value: stats.todayReservations || 0, icon: Calendar, color: 'blue' },
    { title: '예약 대기', value: stats.pendingReservations || 0, icon: Clock, color: 'yellow' },
    { title: '예약 확정', value: stats.confirmedReservations || 0, icon: Users, color: 'green' },
    { title: '취소/노쇼', value: stats.cancelledReservations || 0, icon: AlertCircle, color: 'red' }
  ];

  const getStatusBadge = (status) => (
    <Badge variant={getStatusBadgeColor(status)}>{getStatusText(status)}</Badge>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <Input value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchReservations(1)} />
          <Button onClick={() => fetchReservations(1)}><Search /> 검색</Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchStats}><RefreshCw /> 새로고침</Button>
          <Button><Download /> 엑셀</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Table */}
      <Table
        headers={['스튜디오명', '예약자', '날짜', '시간', '인원', '상태']}
        data={reservations.map(r => [
          r.studioName || '알 수 없음',
          r.userName || '알 수 없음',
          r.reservationDate || '-',
          `${r.startTime} - ${r.endTime}`,
          `${r.peopleCount || 1}명`,
          getStatusBadge(r.status)
        ])}
      />


      {reservations.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">데이터가 없습니다.</div>
      )}
    </div>
  );
};

export default BookingMonitoringPage;
