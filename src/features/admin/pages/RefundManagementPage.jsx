// ✅ 환불 관리 페이지 - 백엔드 연동 기반으로 수정

import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, TrendingDown, Calendar, Download } from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge } from '../components/common';
import adminRefundAPI from '../../../lib/admin/adminRefundAPI';

const RefundManagementPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [failedRefunds, setFailedRefunds] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchRefunds = async () => {
    try {
      const response = await adminRefundAPI.getRefunds(1, 100);
      if (response.success) setRefunds(response.data.refunds);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFailedRefunds = async () => {
    try {
      const response = await adminRefundAPI.getFailedRefunds();
      if (response.success) setFailedRefunds(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDailyStats = async () => {
    try {
      const response = await adminRefundAPI.getDailyRefundStats(dateRange.startDate, dateRange.endDate);
      if (response.success) setDailyStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetryRefund = async (refundId) => {
    try {
      await adminRefundAPI.retryRefund(refundId);
      alert('환불 재처리가 완료되었습니다.');
      fetchFailedRefunds();
    } catch (err) {
      alert('재처리에 실패했습니다.');
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchRefunds(), fetchFailedRefunds(), fetchDailyStats()]);
      } catch {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dateRange]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <Badge variant="success">완료</Badge>;
      case 'pending': return <Badge variant="warning">대기</Badge>;
      case 'failed': return <Badge variant="danger">실패</Badge>;
      case 'processing': return <Badge variant="primary">처리중</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const refundSummary = dailyStats.reduce((acc, stat) => ({
    total: acc.total + (stat.refundCount || 0),
    amount: acc.amount + (stat.totalAmount || 0),
    success: acc.success + (stat.successCount || 0),
    failed: acc.failed + (stat.failureCount || 0)
  }), { total: 0, amount: 0, success: 0, failed: 0 });

  if (loading) return <div className="text-center py-12">로딩 중...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">환불 관리</h1>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" />엑셀 다운로드</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label="총 환불 건수" value={refundSummary.total} color="blue" />
        <SummaryCard label="총 환불 금액" value={`${refundSummary.amount.toLocaleString()}원`} color="green" />
        <SummaryCard label="성공 건수" value={refundSummary.success} color="green" />
        <SummaryCard label="실패 건수" value={failedRefunds.length} color="red" />
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} failedCount={failedRefunds.length} />

      {(activeTab === 'all' || activeTab === 'stats') && (
        <DateFilter dateRange={dateRange} setDateRange={setDateRange} onSearch={fetchDailyStats} />
      )}

      {activeTab === 'all' && (
        <Table
          headers={["ID", "고객명", "스튜디오", "금액", "사유", "상태", "요청일", "처리일"]}
          data={refunds.map(r => [r.id, r.userName, r.studioName, `${r.amount.toLocaleString()}원`, r.reason, getStatusBadge(r.status), r.requestDate, r.processedDate || '-'])}
        />
      )}

      {activeTab === 'failed' && (
        <Table
          headers={["ID", "고객명", "스튜디오", "금액", "실패 사유", "요청일", "마지막 시도일"]}
          data={failedRefunds.map(f => [f.id, f.userName || '-', f.studioName || '-', `${f.amount?.toLocaleString()}원`, f.failureReason, f.requestDate, f.lastAttemptDate])}
          actions={failedRefunds.map(f => [<Button key="retry" size="small" onClick={() => handleRetryRefund(f.id)}><RefreshCw className="w-4 h-4 mr-1" />재처리</Button>])}
        />
      )}

      {activeTab === 'stats' && (
        <Table
          headers={["날짜", "건수", "금액", "성공", "실패", "성공률"]}
          data={dailyStats.map(s => [s.date, s.refundCount, `${s.totalAmount.toLocaleString()}원`, s.successCount, s.failureCount, `${((s.successCount / (s.refundCount || 1)) * 100).toFixed(1)}%`])}
        />
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div className="bg-white p-4 rounded-lg border">
    <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const TabNavigation = ({ activeTab, setActiveTab, failedCount }) => (
  <div className="border-b">
    {['all', 'failed', 'stats'].map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
      >
        {tab === 'all' && '전체 환불'}
        {tab === 'failed' && `실패 관리 (${failedCount})`}
        {tab === 'stats' && '일별 통계'}
      </button>
    ))}
  </div>
);

const DateFilter = ({ dateRange, setDateRange, onSearch }) => (
  <div className="bg-white p-4 rounded-lg border flex items-center space-x-4">
    <Calendar className="w-4 h-4 text-gray-400" />
    <label className="text-sm font-medium text-gray-700">기간:</label>
    <input
      type="date"
      value={dateRange.startDate}
      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
      className="border rounded-lg px-3 py-2"
    />
    <span className="text-gray-500">~</span>
    <input
      type="date"
      value={dateRange.endDate}
      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
      className="border rounded-lg px-3 py-2"
    />
    <Button onClick={onSearch}>조회</Button>
  </div>
);

export default RefundManagementPage;
