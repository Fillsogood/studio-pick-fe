// Complete refactored BookingMonitoringPage using adminReservationAPI

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, AlertCircle, RefreshCw, Search, Download } from 'lucide-react';
import { Table, StatCard, SimpleBarChart, AlertCard } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import reservationAPI from '../../../lib/admin/adminReservationAPI';
import { formatDateTime, getStatusBadgeColor, getStatusText, STATUS_CODES } from '../../../lib/admin';

const BookingMonitoringPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({});
  const [hourlyData, setHourlyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  const fetchReservations = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationAPI.getAllReservations(page, 10, null, selectedDate, selectedDate, null, null, searchKeyword || null);
      if (response.success) {
        setReservations(response.data.reservations || []);
        setTotalPages(response.data.totalPages || 1);
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
        generateHourlyData(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateHourlyData = (statsData) => {
    if (!statsData.hourlyDistribution) return;
    const max = Math.max(...statsData.hourlyDistribution.map(item => item.count), 1);
    setHourlyData(statsData.hourlyDistribution.map(item => ({
      label: `${item.hour}:00`,
      value: item.count,
      percentage: (item.count / max) * 100
    })));
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

  const handleStatusChange = async (id, status) => {
    if (processingIds.has(id)) return;
    const reason = prompt(`${getStatusText(status)} 사유를 입력하세요:`);
    if (!reason) return;
    try {
      setProcessingIds(prev => new Set(prev).add(id));
      await reservationAPI.changeReservationStatus(id, status, reason);
      fetchReservations(currentPage);
      fetchStats();
    } finally {
      setProcessingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const statsCards = [
    { title: '오늘 예약', value: stats.todayReservations || 0, icon: Calendar, color: 'blue' },
    { title: '진행 중', value: stats.ongoingReservations || 0, icon: Clock, color: 'green' },
    { title: '완료', value: stats.completedReservations || 0, icon: Users, color: 'teal' },
    { title: '취소/노쇼', value: stats.cancelledReservations || 0, icon: AlertCircle, color: 'red' }
  ];

  const getStatusBadge = (status) => (
    <Badge variant={getStatusBadgeColor(status)}>{getStatusText(status)}</Badge>
  );

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <Input value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchReservations(1)} />
          <Button onClick={() => fetchReservations(1)}>검색</Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => fetchStats()}><RefreshCw /> 새로고침</Button>
          <Button><Download /> 엑셀</Button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsCards.map((card, i) => <StatCard key={i} {...card} />)}
      </div>
      {/* Chart */}
      <SimpleBarChart data={hourlyData} title="시간대별 예약 현황" />
      {/* Table */}
      <Table headers={['스튜디오명', '예약자', '시간', '인원', '상태']} data={reservations.map(r => [
        r.studioInfo?.name, r.userInfo?.name, formatDateTime(r.reservationDate), `${r.participantCount || 1}명`, getStatusBadge(r.status)
      ])} />
    </div>
  );
};

export default BookingMonitoringPage;
